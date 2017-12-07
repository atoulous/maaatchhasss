import { MongoClient, ObjectId } from 'mongodb';
import Joi from 'joi';
import _ from 'lodash';
import moment from 'moment-timezone';

import config from '../../config/index';

const userSchemaCreate = Joi.object().keys({
  name: Joi.string().required(),
  login: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  score: Joi.number().default(0, 'Set score to 0'),
  creationDate: Joi.date().default(() => moment().format(), 'Set creation date'),
  lastConnection: Joi.date().default(() => moment().format(), 'Set last connection date')
}).unknown();

const userSchemaUpdate = Joi.object().keys({
  name: Joi.string(),
  login: Joi.string(),
  email: Joi.string(),
  password: Joi.string(),
  age: Joi.number().allow(null),
  sexe: Joi.string().allow(null),
  affinity: Joi.string().allow(null),
  interests: Joi.array().allow(null),
  bio: Joi.string().allow(null),
  photo: Joi.string().allow(null),
  likes: Joi.array().items(Joi.object()).allow(null),
  dislikes: Joi.array().allow(null),
  notifications: Joi.array().allow(null),
  score: Joi.number().allow(null),
  updateDate: Joi.date().default(() => moment().format(), 'Set update date')
}).unknown();

/**
 * Insert a user in database.
 *
 * @param {object} user - The user informations.
 * @returns {object} the user found
 */
export const insertOne = async (user) => {
  const userValidated = Joi.attempt(user, userSchemaCreate);

  const db = await MongoClient.connect(config.db.url);
  const res = await db.collection('users').insertOne(userValidated);
  db.close();

  return res.ops[0] || null;
};

/**
 * Update a user in database.
 *
 * @param {string} _id - The user id.
 * @param {object} user - The user informations.
 * @returns {object} the user updated
 */
export async function update(_id, user) {
  const userValidated = Joi.attempt(user, userSchemaUpdate);

  const db = await MongoClient.connect(config.db.url);
  const res = await db.collection('users').findOneAndUpdate(
    { _id: ObjectId(_id) },
    { $set: userValidated },
    { upsert: true, returnOriginal: false }
  );
  db.close();

  return res.value || null;
}

/**
 * Update a user score.
 *
 * @param {string} _id - The user id.
 * @param {number} points - The points win.
 * @returns {object} the user updated
 */
export async function updateScore(_id, points) {
  const db = await MongoClient.connect(config.db.url);
  const res = await db.collection('users').findOneAndUpdate(
    { _id: ObjectId(_id) },
    { $inc: { score: points } },
    { upsert: true, returnOriginal: false }
  );
  db.close();

  return res.value || null;
}

/**
 * Find a user by its login.
 *
 * @param {string} login
 * @param {string/array} option - the param(s) to send back
 * @returns {user} the user found
 */
export async function findByLogin(login, option) {
  const db = await MongoClient.connect(config.db.url);
  const user = await db.collection('users').findOne({ login });
  db.close();

  if (option) return _.get(user, option, null);
  return user || null;
}

/**
 * Find a user by its email.
 *
 * @param {string} email
 * @returns {user} the user found
 */
export async function findByEmail(email) {
  const db = await MongoClient.connect(config.db.url);
  const user = await db.collection('users').findOne({ email });
  db.close();

  return user || null;
}

/**
 * Find a user by its id.
 *
 * @param {string} id - the id of a user.
 * @param {string/array} option - the param(s) to send back
 * @returns {user} the user found
 */
export async function findById(id, option) {
  const db = await MongoClient.connect(config.db.url);
  const user = await db.collection('users').findOne({ _id: ObjectId(id) });
  db.close();

  if (option) return _.get(user, option, null);
  return user || null;
}

/**
 * Find all users.
 *
 * @returns {users} all users
 */
export const findAll = async () => {
  const db = await MongoClient.connect(config.db.url);
  const users = await db.collection('users').find().sort({ date: -1 }).toArray();
  db.close();

  return users || null;
};
