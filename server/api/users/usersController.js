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
export const signIn = async (req, res) => {
  try {
    const user = req.body;
    if ((user.login && !config.regexInput.test(user.login))
      || (user.password && !config.regexPassword.test(user.password))) {
      throw new Error('Regex Safety, login impossible');
    }

    const userFound = await usersModel.findByLogin(user.login);
    if (userFound) {
      if (bcrypt.compareSync(user.password, userFound.password)) {
        res.status(HttpStatus.OK).json(_.omit(userFound, 'password'));
      } else {
        res.status(HttpStatus.OK).json({ why: 'BAD_PASSWORD' });
      }
    } else {
      res.status(HttpStatus.OK).json({ why: 'BAD_LOGIN' });
    }
  } catch (err) {
    console.error('/api/users/signIn', err);
  }
};

/**
 * Create/sign up a user.
 *
 * @param {request} req - The request
 * @param {response} res - The response
 * @returns {void}
 */
export const signUp = async (req, res) => {
  try {
    const user = req.body;
    if ((user.name && !config.regexInput.test(user.name))
      || (user.login && !config.regexInput.test(user.login))
      || (user.password && !config.regexPassword.test(user.password))
      || (user.email && !config.regexEmail.test(user.email))) {
      throw new Error('Regex Safety, creation impossible');
    }

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
};

/**
 * Update a user.
 *
 * @param {request} req - The request
 * @param {response} res - The response
 * @returns {void}
 */
export const update = async (req, res) => {
  try {
    console.log('api/user/update/body==', req.body);
    const user = req.body;
    if ((user.name && !config.regexInput.test(user.name))
      || (user.login && !config.regexInput.test(user.login))
      || (user.password && !config.regexPassword.test(user.password))
      || (user.sexe && !config.regexInput.test(user.sexe))
      || (user.affinity && !config.regexInput.test(user.affinity))
      || (user.email && !config.regexEmail.test(user.email))) {
      throw new Error('Regex Safety, update impossible');
    }

    const [resLogin, resEmail] = [
      await usersModel.findByLogin(user.login),
      await usersModel.findByEmail(user.email)
    ];
    if ((resLogin && _.isEqual(resLogin._id, req.user._id))
      || (resEmail && _.isEqual(resEmail._id, req.user._id))) {
      const why = resLogin ? 'LOGIN_USED' : 'EMAIL_USED';
      res.status(HttpStatus.OK).json({ why });
    } else {
      user.role = user.password === config.adminPassword ? 'admin' : 'user';
      if (user.password) user.password = bcrypt.hashSync(user.password, config.hashSalt);

      await usersModel.update(req.user._id, user);

      user._id = req.user._id;
      res.status(HttpStatus.OK).json(_.omit(user, 'password'));
    }
  } catch (err) {
    console.error('/api/users/update', err);
  }
};

/**
 * Find one user.
 *
 * @param {request} req - The request
 * @param {response} res - The response
 * @returns {void}
 */
export const findOne = async (req, res) => {
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
};

/**
 * Find all users.
 *
 * @param {request} req - The request
 * @param {response} res - The response
 * @returns {void}
 */
export const findAll = async (req, res) => {
  try {
    const users = await usersModel.findAll();
    res.json(users);
    res.status(HttpStatus.OK);
  } catch (err) {
    throw new Error({ err }, 'api/users/findAll');
  }
};
