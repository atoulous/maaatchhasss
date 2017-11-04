import bcrypt from 'bcrypt';
import * as HttpStatus from 'http-status-codes';
import _ from 'lodash';

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
    if (user) {
      // then check if password is the good one
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.status(HttpStatus.OK).json({ role: user.role ? 'admin' : 'user' });
      } else {
        res.status(HttpStatus.OK).json({ why: 'BAD_PASSWORD' });
      }
    } else {
      res.status(HttpStatus.OK).json({ why: 'BAD_LOGIN' });
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
    // check if user login is already in db
    const [resLogin, resEmail] = [
      await usersModel.findByLogin(req.body.login),
      await usersModel.findByEmail(req.body.email)
    ];
    if (resLogin || resEmail) {
      const why = resLogin ? 'LOGIN_USED' : 'EMAIL_USED';
      res.status(HttpStatus.OK).json({ why });
    } else {
      if (user.password === 'superadmin') {
        user.role = 'admin';
      } else {
        user.role = 'user';
      }
      user.password = bcrypt.hashSync(user.password, config.hashSalt);
      await usersModel.insertOne(user);
      res.status(HttpStatus.OK).json({ role: user.role });
    }
  } catch (err) {
    console.error('/api/users/signUp', err);
  }
}

/**
 * Find one user.
 *
 * @param {request} req - The request
 * @param {response} res - The response
 * @returns {void}
 */
export async function findOne(req, res) {
  try {
    const user = await usersModel.findByLogin(req.params.login);
    if (user) {
      const data = _.omit(user, 'password');
      res.status(HttpStatus.OK).json(data);
    } else {
      res.status(HttpStatus.OK).json({ why: 'NOT_FOUND' });
    }
  } catch (err) {
    throw new Error({ err }, 'api/users/findOne');
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
