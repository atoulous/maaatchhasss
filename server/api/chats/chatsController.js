import * as HttpStatus from 'http-status-codes';

import * as chatsModel from './chatsModel';
import * as usersModel from '../users/usersModel';

/**
 * (post) Add a chat in collection 'chats'
 *
 * @param {request} req - The request
 * @param {response} res - The response
 * @returns {void}
 */
export async function add(req, res) {
  try {
    // console.log('chats/add/body==', req.body);

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
    // console.log('api/chat/findConversation/reqBody==', req.body);

    if (!req.body || !req.body.senderLogin || !req.body.recipientLogin) {
      const error = 'MISSING PARAMS';
      res.status(HttpStatus.BAD_REQUEST).json(error);
      throw new Error(error);
    }

    const [sender, recipient] = await Promise.all([
      usersModel.findByLogin(req.body.senderLogin),
      usersModel.findByLogin(req.body.recipientLogin)
    ]);
    if (!recipient || !sender) {
      res.status(HttpStatus.OK).json('User not found');
      return;
    }

    const chats = await chatsModel.findAllOf(sender._id);

    // stringify to compare
    const senderId = sender._id.toString();
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
