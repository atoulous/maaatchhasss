import { MongoClient } from 'mongodb';
import Joi from 'joi';

import config from '../../config';

const userSchema = Joi.object().keys({
  name: Joi.string(),
  login: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  city: Joi.string(),
  sexe: Joi.string()
}).unknown();

/**
 * Insert a user in database.
 *
 * @param {object} user - The user informations.
 * @returns {object} the user found
 */
export async function insertOne(user) {
  const userValidated = Joi.attempt(user, userSchema);

  const db = await MongoClient.connect(config.db.url);
  const res = await db.collection('users').insertOne(userValidated);
  db.close();

  return res || null;
}

/**
 * Find a user by its login.
 *
 * @param {string} login
 * @returns {user} the user found
 */
export async function findByLogin(login) {
  const db = await MongoClient.connect(config.db.url);
  const user = await db.collection('users').findOne({ login });
  db.close();

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
 * @param {ObjectId} id - the id of a user.
 * @returns {user} the user found
 */
export async function findById(id) {
  const db = await MongoClient.connect(config.db.url);
  const user = await db.collection('users').findOne(id);
  db.close();

  return user || null;
}

/**
 * Find all users.
 *
 * @returns {users} all users
 */
export async function findAll() {
  const db = await MongoClient.connect(config.db.url);
  const users = await db.collection('users').find().sort({ date: -1 }).toArray();
  db.close();

  return users || null;
}
