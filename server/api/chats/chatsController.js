import * as HttpStatus from 'http-status-codes';
import _ from 'lodash';
import { ObjectId } from 'mongodb';

import * as chatsModel from './chatsModel';
import * as usersModel from '../users/usersModel';

/**
 * (webSocket) Add a chat after received a web socket
 *
 * @param {object} chat - the chat object
 * @returns {void}
 */
export async function receivedChat(chat) {
  try {
    console.log('chats/receivedChat/chat==', chat);

    if (!chat || !chat.message || !chat.fromLogin || !chat.toLogin) throw new Error('MISSING PARAMS');

    const [sender, recipient] = await Promise.all([
      usersModel.findByLogin(chat.fromLogin),
      usersModel.findByLogin(chat.toLogin)
    ]);
    if (!sender || !recipient) throw new Error('USERS NOT FOUND');

    const newChat = {
      message: chat.message,
      from: sender._id,
      to: recipient._id
    };

    const res = await chatsModel.insertOne(newChat);
    console.log('api/chats/receivedChat/res==', res);
  } catch (err) {
    console.error('/api/chats/add', err);
  }
}

/**
 * (post) Add a chat in collection 'chats'
 *
 * @param {request} req - The request
 * @param {response} res - The response
 * @returns {void}
 */
export async function add(req, res) {
  try {
    console.log('chats/add/body==', req.body);

    if (!req.body || !req.body.message || !req.body.fromLogin || !req.body.toLogin) {
      const error = 'MISSING PARAMS';
      res.status(HttpStatus.BAD_REQUEST).json(error);
      throw new Error(error);
    }

    const [sender, recipient] = await Promise.all([
      usersModel.findByLogin(req.body.fromLogin),
      usersModel.findByLogin(req.body.toLogin)
    ]);
    if (!sender || !recipient) throw new Error('USERS NOT FOUND');

    const newChat = {
      message: req.body.message,
      from: sender._id,
      to: recipient._id
    };
    const chatAdded = await chatsModel.insertOne(newChat);

    // stringify to compare
    const senderId = sender._id.toString();
    const recipientId = recipient._id.toString();

    chatAdded.fromLogin = chatAdded.from.toString() === senderId ?
      req.body.fromLogin : req.body.toLogin;
    chatAdded.toLogin = chatAdded.to.toString() === recipientId ?
      req.body.toLogin : req.body.fromLogin;

    res.status(HttpStatus.OK).json(chatAdded);
  } catch (err) {
    console.error('/api/chats/add', err);
  }
}

/**
 * (put) Delete a chat
 *
 * @param {request} req - The request
 * @param {response} res - The response
 * @returns {void}
 */
export const remove = async (req, res) => {
  try {
    if (!req.body || !req.body.id) {
      const error = 'MISSING PARAMS';
      res.status(HttpStatus.BAD_REQUEST).json(error);
      throw new Error(error);
    }

    await chatsModel.remove(req.body.id);
    res.status(HttpStatus.OK);
  } catch (err) {
    console.error('/api/chats/remove', err);
  }
};

/**
 * (post) Find the conversation between two users
 *
 * @param {request} req - The request
 * @param {response} res - The response
 * @returns {void}
 */
export const findConversation = async (req, res) => {
  try {
    console.log('api/chat/FindOne/reqBody==', req.body);

    if (!req.body || !req.body.senderLogin || !req.body.recipientLogin) {
      const error = 'MISSING PARAMS';
      res.status(HttpStatus.BAD_REQUEST).json(error);
      throw new Error(error);
    }

    const recipient = await usersModel.findByLogin(req.body.recipientLogin);

    const [chatsSender, chatsRecipient] = await Promise.all([
      chatsModel.findAllOf(req.user._id),
      chatsModel.findAllOf(recipient._id)
    ]);

    const chats = _.merge(chatsSender, chatsRecipient);

    // stringify to compare
    const senderId = req.user._id.toString();
    const recipientId = recipient._id.toString();

    const conversation = [];
    for (const chat of chats) {
      if ((chat.from.toString() === senderId && chat.to.toString() === recipientId)
        || (chat.from.toString() === recipientId && chat.to.toString() === senderId)) {
        chat.fromLogin = chat.from.toString() === senderId ?
          req.body.senderLogin : req.body.recipientLogin;
        chat.toLogin = chat.to.toString() === recipientId ?
          req.body.recipientLogin : req.body.senderLogin;
        conversation.push(chat);
      }
    }

    res.status(HttpStatus.OK).json(conversation);
  } catch (err) {
    console.error('/api/chats/findAllOf', err);
  }
};

/**
 * (get) Find all chats for a user by its id
 *
 * @param {request} req - The request
 * @param {response} res - The response
 * @returns {void}
 */
export const findAllOf = async (req, res) => {
  try {
    if (!req.params || !req.params.id) {
      const error = 'MISSING PARAMS';
      res.status(HttpStatus.BAD_REQUEST).json(error);
      throw new Error(error);
    }
    const chats = await chatsModel.findAllOf(req.params.id);

    for (const chat of chats) {
      const [fromUser, toUser] = await Promise.all([ // eslint-disable-line
        usersModel.findById(chat.from, 'login'),
        usersModel.findById(chat.to, 'login')
      ]);
      chat.fromLogin = fromUser;
      chat.toLogin = toUser;
    }

    res.status(HttpStatus.OK).json(chats);
  } catch (err) {
    console.error('/api/chats/findAllOf', err);
  }
};
