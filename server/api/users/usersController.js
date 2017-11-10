import bcrypt from 'bcrypt';
import * as HttpStatus from 'http-status-codes';
import _ from 'lodash';

import * as usersModel from './usersModel';
import config from '../../config/index';

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
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.status(HttpStatus.OK).json(_.omit(user, 'password'));
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
      await usersModel.findByLogin(user.login),
      await usersModel.findByEmail(user.email)
    ];
    if (resLogin || resEmail) {
      const why = resLogin ? 'LOGIN_USED' : 'EMAIL_USED';
      res.status(HttpStatus.OK).json({ why });
    } else {
      user.role = user.password === 'superadmin' ? 'admin' : 'user';
      user.password = bcrypt.hashSync(user.password, config.hashSalt);

      const userInserted = await usersModel.insertOne(user);

      res.status(HttpStatus.OK).json(_.omit(userInserted, 'password'));
    }
  } catch (err) {
    console.error('/api/users/signUp', err);
  }
}

/**
 * Update a user.
 *
 * @param {request} req - The request
 * @param {response} res - The response
 * @returns {void}
 */
export async function update(req, res) {
  try {
    const user = req.body;
    // check if the new login/email is already in db
    const [resLogin, resEmail] = [
      await usersModel.findByLogin(user.login),
      await usersModel.findByEmail(user.email)
    ];
    if ((resLogin && _.isEqual(resLogin._id, req.user._id))
      || (resEmail && _.isEqual(resEmail._id, req.user._id))) {
      const why = resLogin ? 'LOGIN_USED' : 'EMAIL_USED';
      res.status(HttpStatus.OK).json({ why });
    } else {
      user.role = user.password === 'superadmin' ? 'admin' : 'user';
      user.password = bcrypt.hashSync(user.password, config.hashSalt);

      await usersModel.update(req.user._id, user);

      user._id = req.user._id;
      res.status(HttpStatus.OK).json(_.omit(user, 'password'));
    }
  } catch (err) {
    console.error('/api/users/update', err);
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
    res.json(users);
    res.status(HttpStatus.OK);
  } catch (err) {
    throw new Error({ err }, 'api/users/findAll');
  }
}
