import bcrypt from 'bcrypt';
import * as HttpStatus from 'http-status-codes';
import moment from 'moment-timezone';
import _ from 'lodash';
import { ObjectId } from 'mongodb';

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
        await usersModel.update(userFound._id, { lastConnection: moment().format() });

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
    if (!req.params || !req.params._id || !req.body) {
      const error = 'MISSING PARAMS';
      res.status(HttpStatus.BAD_REQUEST).json(error);
      throw new Error(error);
    }

    const user = req.body;
    if ((user.name && !config.regexInput.test(user.name))
      || (user.login && !config.regexInput.test(user.login))
      || (user.oldPassword && !config.regexPassword.test(user.oldPassword))
      || (user.newPassword && !config.regexPassword.test(user.newPassword))
      || (user.sexe && !config.regexInput.test(user.sexe))
      || (user.affinity && !config.regexInput.test(user.affinity))
      || (user.email && !config.regexEmail.test(user.email))) {
      throw new Error('Regex Safety, update impossible');
    }

    if (user.oldPassword && user.newPassword) {
      const userFound = await usersModel.findById(req.params._id);
      if (!bcrypt.compareSync(user.oldPassword, userFound.password)) {
        res.status(HttpStatus.OK).json('BAD_OLD_PASSWORD');
        return;
      }
    }

    if (!_.isEmpty(user.likes)) {
      user.likes.map((id, index) => user.likes[index] = ObjectId(id)); // eslint-disable-line
      console.log('api/users/updates/likes=', user.likes);
    }
    if (!_.isEmpty(user.dislikes)) {
      user.dislikes.map((id, index) => user.dislikes[index] = ObjectId(id)); // eslint-disable-line
      console.log('api/users/updates/dislikes=', user.dislikes);
    }

    const [resLogin, resEmail] = [
      await usersModel.findByLogin(req.user.login),
      await usersModel.findByEmail(user.email)
    ];
    if ((resLogin && _.isEqual(resLogin._id, req.user._id))
      || (resEmail && _.isEqual(resEmail._id, req.user._id))) {
      const why = resLogin ? 'LOGIN_USED' : 'EMAIL_USED';

      res.status(HttpStatus.OK).json(why);
    } else {
      user.role = user.newPassword === config.adminPassword ? 'admin' : 'user';
      if (user.newPassword) user.password = bcrypt.hashSync(user.newPassword, config.hashSalt);

      const userUpdated = await usersModel.update(req.params._id, user);

      res.status(HttpStatus.OK).json(_.omit(userUpdated, 'password'));
    }
  } catch (err) {
    console.error('/api/users/update', err);
  }
};

/**
 * Update user's score after like by someone.
 *
 * @param {request} req - The request
 * @param {response} res - The response
 * @returns {void}
 */
export async function updateScore(req, res) {
  try {
    console.log('api/users/updateScore', req.params);

    if (!req.params || !req.params._id || !req.params.action) {
      const error = 'MISSING PARAMS';
      res.status(HttpStatus.BAD_REQUEST).json(error);
      throw new Error(error);
    }

    let score = 0;
    _.map(config.score, (action, key) => {
      if (req.params.action === key) score = action;
    });

    await usersModel.updateScore(req.params._id, score);

    res.status(HttpStatus.OK).json();
  } catch (err) {
    console.error('/api/users/updateScoreLike', err);
  }
}

/**
 * (get) Find user by its id.
 *
 * @param {request} req - The request
 * @param {response} res - The response
 * @returns {void}
 */
export const findById = async (req, res) => {
  try {
    if (!req.params || !req.params._id) {
      const error = 'MISSING PARAMS';
      res.status(HttpStatus.BAD_REQUEST).json(error);
      throw new Error(error);
    }
    const user = await usersModel.findById(req.params._id);
    if (user) {
      const data = _.omit(user, 'password');
      res.status(HttpStatus.OK).json(data);
    } else {
      const error = 'USER NOT FOUND';
      res.status(HttpStatus.NOT_FOUND).json(error);
      throw new Error(error);
    }
  } catch (err) {
    console.error('api/users/findById', err);
  }
};

/**
 * (get) Find one user by its login.
 *
 * @param {request} req - The request
 * @param {response} res - The response
 * @returns {void}
 */
export const findByLogin = async (req, res) => {
  try {
    if (!req.params || !req.params.login) {
      const error = 'MISSING PARAMS';
      res.status(HttpStatus.BAD_REQUEST).json(error);
      throw new Error(error);
    }
    const user = await usersModel.findByLogin(req.params.login);
    if (user) {
      const data = _.omit(user, 'password');
      res.status(HttpStatus.OK).json(data);
    } else {
      const error = 'USER NOT FOUND';
      res.status(HttpStatus.NOT_FOUND).json(error);
      throw new Error(error);
    }
  } catch (err) {
    console.error('api/users/findByLogin', err);
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
    console.error('api/users/findAll', err);
  }
};

/**
 * (get) Find all matchs of current user.
 *
 * @param {request} req - The request
 * @param {response} res - The response
 * @returns {void}
 */
export async function findMatchs(req, res) {
  try {
    console.log('api/users/findMatchs/req.params==', req.params);

    if (!req.params || !req.params._id) {
      const error = 'MISSING PARAMS';
      res.status(HttpStatus.BAD_REQUEST).json(error);
      throw new Error(error);
    }
    const _id = req.params._id;
    const likes = await usersModel.findById(_id, 'likes');

    const matchs = [];
    if (likes) {
      for (const like of likes) {
        const user = await usersModel.findById(like); // eslint-disable-line
        if (user && !_.isEmpty(user.likes)) {
          for (const userLike of user.likes) {
            if (userLike.toString() === _id) matchs.push(user);
          }
        }
      }
    }

    res.status(HttpStatus.OK).json(matchs);
  } catch (err) {
    console.error('api/users/findMatchs', err);
  }
}

/**
 * (get) Find all possible like for a current user.
 *
 * @param {request} req - The request
 * @param {response} res - The response
 * @returns {void}
 */
export async function findByAffinity(req, res) {
  try {
    // console.log('api/users/findByAffinity/req.params==', req.params);

    if (!req.params || !req.params._id) {
      const error = 'MISSING PARAMS';
      res.status(HttpStatus.BAD_REQUEST).json(error);
      throw new Error(error);
    }
    const _id = req.params._id;
    const currentUser = await usersModel.findById(_id);
    if (!currentUser) throw new Error('USER NOT FOUND');

    const allUsers = await usersModel.findAll();

    const affinities = [];
    for (const user of allUsers) {
      if ((user && user.login !== currentUser.login)
        && (currentUser.affinity === user.sexe || currentUser.affinity === 'both')
        && (user.affinity === currentUser.sexe || user.affinity === 'both')) {
        affinities.push(_.omit(user, 'password'));
      }
    }

    res.status(HttpStatus.OK).json({ affinities, currentUser: _.omit(currentUser, 'password') });
  } catch (err) {
    console.error('api/users/findByAffinity', err);
  }
}
