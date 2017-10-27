import bcrypt from 'bcrypt';
import * as HttpStatus from 'http-status-codes';

import * as usersModel from './usersModel';
import config from '../../config';

/**
 * Log in/sign in a user.
 *
 * @param {request} req - The request
 * @param {response} res - The response
 * @returns {void}
 */
export async function signIn(req, res) {
  try {
    const user = await usersModel.findByLogin(req.body.login);
console.log('body===', req.body);
    if (user) {
      // then check if password is the good one and return OK (200), else return UNAUTHORIZED (401)
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.sendStatus(HttpStatus.OK);
      } else {
        res.sendStatus(HttpStatus.UNAUTHORIZED);
      }
    } else {
      res.sendStatus(HttpStatus.NOT_FOUND);
    }
  } catch (err) {
    console.error('/api/users/signIn', err);
  }
}

/**
 * Create/sign up a user.
 *
 * @param {request} req - The request
 * @param {response} res - The response
 * @returns {void}
 */
export async function signUp(req, res) {
  try {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, config.hashSalt);
    await usersModel.insertOne(user);
    res.sendStatus(HttpStatus.CREATED);
  } catch (err) {
    console.error('/api/users/signUp', err);
  }
}

/**
 * Find all users.
 *
 * @param {request} req - The request
 * @param {response} res - The response
 * @returns {void}
 */
export async function findAll(req, res) {
  try {
    const users = await usersModel.findAll();
    // const users = [{ login: 'aymeric' }, { login: 'tom' }];
    // return OK (200) and all users found
    res.json(users);
    res.status(HttpStatus.OK);
  } catch (err) {
    throw new Error({ err }, 'api/users/findAll');
  }
}
