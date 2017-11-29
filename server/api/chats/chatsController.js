import * as HttpStatus from 'http-status-codes';
import _ from 'lodash';

import * as chatsModel from './chatsModel';
import * as usersModel from '../users/usersModel';

/**
 * (post) Add a chat in collection 'chats'
 *
 * @param {request} req - The request
 * @param {response} res - The response
 * @returns {void}
 */
export const add = async (req, res) => {
  try {
    console.log('chats/add/req==', req.body);
    if (!req.body || !req.body.message || !req.body.from || !req.body.to) {
      const error = 'MISSING PARAMS';
      res.status(HttpStatus.BAD_REQUEST).json(error);
      throw new Error(error);
    }
    const [user1, user2] = await Promise.all([
      usersModel.findById(req.body.from),
      usersModel.findById(req.body.to)
    ]);
    if (!user1 || !user2) throw new Error('USERS NOT FOUND');

    const newChat = {
      message: req.body.message,
      from: user1._id,
      to: user2._id
    };
    const chatAdded = await chatsModel.insertOne(newChat);
    res.status(HttpStatus.OK).json(chatAdded);
  } catch (err) {
    console.error('/api/chats/add', err);
  }
};

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
