import { MongoClient } from 'mongodb';
import Joi from 'joi';
import moment from 'moment-timezone';

import config from '../../config/index';

const userSchema = Joi.object().keys({
  tag: Joi.string().required(),
  creator: Joi.string().required(),
  creationDate: Joi.date().default(() => moment().format(), 'Set creation date')
}).unknown();

/**
 * Insert a tag in database.
 *
 * @param {object} tag - The user informations.
 * @returns {object} the user found
 */
export async function insertOne(tag) {
  const tagValidated = Joi.attempt(tag, userSchema);

  const db = await MongoClient.connect(config.db.url);
  const res = await db.collection('tags').insertOne(tagValidated);
  db.close();

  return res.ops[0] || null;
}

/**
 * Remove a tag in database.
 *
 * @param {object} tag - The user informations.
 * @returns {object} the user found
 */
export async function remove(tag) {
  const db = await MongoClient.connect(config.db.url);
  const res = await db.collection('tags').remove({ tag });
  db.close();

  return res || null;
}

/**
 * Find a tag by its tag name.
 *
 * @param {string} tag
 * @returns {user} the user found
 */
export async function findByTag(tag) {
  const db = await MongoClient.connect(config.db.url);
  const tagFound = await db.collection('tags').findOne({ tag });
  db.close();

  return tagFound || null;
}

/**
 * Find tags by its creator.
 *
 * @param {string} creator
 * @returns {user} the tags found
 */
export async function findByCreator(creator) {
  const db = await MongoClient.connect(config.db.url);
  const tags = await db.collection('tags').find({ creator }).sort({ date: -1 }).toArray();
  db.close();

  return tags || null;
}

/**
 * Find all tags.
 *
 * @returns {users} all tags
 */
export async function findAll() {
  const db = await MongoClient.connect(config.db.url);
  const tags = await db.collection('tags').find().sort({ date: -1 }).toArray();
  db.close();

  return tags || null;
}
