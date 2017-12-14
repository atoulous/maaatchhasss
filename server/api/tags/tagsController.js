import * as HttpStatus from 'http-status-codes';
import { ObjectId } from 'mongodb';

import * as tagsModel from './tagsModel';

/**
 * (post) Create a tag
 *
 * @param {request} req - The request
 * @param {response} res - The response
 * @returns {void}
 */
export const add = async (req, res) => {
  try {
    if (!req.body || !req.body.tag) {
      throw new Error('MISSING PARAMS');
    }
    const tag = await tagsModel.findByTag(req.body.tag);
    if (tag) {
      res.status(HttpStatus.OK).json('TAG_EXISTS');
    } else {
      const newTag = {
        tag: req.body.tag,
        creator: ObjectId(req.user._id)
      };
      await tagsModel.insertOne(newTag);
      res.status(HttpStatus.OK).json('ADDED');
    }
  } catch (err) {
    console.error('/api/tags/add', err);
  }
};

/**
 * (put) Delete a tag
 *
 * @param {request} req - The request
 * @param {response} res - The response
 * @returns {void}
 */
export const remove = async (req, res) => {
  try {
    const tag = await tagsModel.findByTag(req.body.tag);
    if (!tag) {
      res.status(HttpStatus.OK).json({ why: 'TAG_NOT_FOUND' });
    } else {
      await tagsModel.remove(tag);
      res.status(HttpStatus.OK);
    }
  } catch (err) {
    console.error('/api/tags/remove', err);
  }
};

/**
 * (get) Find a tag by tag name
 *
 * @param {request} req - The request
 * @param {response} res - The response
 * @returns {void}
 */
export const findOne = async (req, res) => {
  try {
    if (!req.params || !req.params.tag) {
      throw new Error('MISSING PARAMS');
    }
    const tag = await tagsModel.findByTag(req.body.tag);
    if (!tag) {
      res.status(HttpStatus.OK).json({ why: 'TAG_NOT_FOUND' });
    } else {
      res.status(HttpStatus.OK).json(tag);
    }
  } catch (err) {
    console.error('/api/tags/findOne', err);
  }
};

/**
 * (get) Find tags by creator login
 *
 * @param {request} req - The request
 * @param {response} res - The response
 * @returns {void}
 */
export const findByCreator = async (req, res) => {
  try {
    if (!req.params || !req.params.creator) {
      throw new Error('MISSING PARAMS');
    }
    const tags = await tagsModel.findByCreator(req.body.login);
    res.status(HttpStatus.OK).json(tags);
  } catch (err) {
    console.error('/api/tags/findByCreator', err);
  }
};

/**
 * Find a tag by tag name
 *
 * @param {request} req - The request
 * @param {response} res - The response
 * @returns {void}
 */
export const findAll = async (req, res) => {
  try {
    const tag = await tagsModel.findAll();
    res.status(HttpStatus.OK).json(tag);
  } catch (err) {
    console.error('/api/tags/findAll', err);
  }
};
