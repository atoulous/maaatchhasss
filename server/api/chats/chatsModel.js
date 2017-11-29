import { MongoClient, ObjectId } from 'mongodb';
import Joi from 'joi';

import moment from 'moment-timezone';

import config from '../../config/index';

Joi.objectId = require('joi-objectid')(Joi);

const chatSchema = Joi.object().keys({
  message: Joi.string().required(),
  from: Joi.objectId().required(),
  to: Joi.objectId().required(),
  date: Joi.date().default(() => moment().format(), 'Set date')
}).unknown();

/**
 * Insert a chat in database.
 *
 * @param {object} chat - The chat.
 * @returns {object} the chat inserted
 */
export async function insertOne(chat) {
  const chatValidated = Joi.attempt(chat, chatSchema);

  const db = await MongoClient.connect(config.db.url);
  const res = await db.collection('chats').insertOne(chatValidated);
  db.close();

  return res.ops[0] || null;
}

/**
 * Remove a chat in database.
 *
 * @param {object} id - The id of chat.
 * @returns {object} the res
 */
export async function remove(id) {
  const db = await MongoClient.connect(config.db.url);
  const res = await db.collection('tags').remove({ _id: ObjectId(id) });
  db.close();

  return res || null;
}


/**
 * Find all chats/messages for a current user and send back sorted.
 *
 * @param {string} userId - The user id.
 * @returns {array} all chats
 */
export async function findAllOf(id) {
  const db = await MongoClient.connect(config.db.url);
  const chats = await db.collection('chats')
    .find({ $or: [{ from: ObjectId(id) }, { to: ObjectId(id) }] })
    .sort({ date: -1 })
    .toArray();
  db.close();
  return chats || null;
}
