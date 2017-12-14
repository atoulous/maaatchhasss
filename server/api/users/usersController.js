import bcrypt from 'bcrypt';
import * as HttpStatus from 'http-status-codes';
import moment from 'moment-timezone';
import _ from 'lodash';
import { ObjectId } from 'mongodb';
import Joi from 'joi';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import geolib from 'geolib';

import { handleMatch } from '../../helpers/socketio';
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
    // console.log('api/users/signIn', req.body);

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
        res.status(HttpStatus.OK).json('BAD_PASSWORD');
      }
    } else {
      res.status(HttpStatus.OK).json('BAD_LOGIN');
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
      res.status(HttpStatus.OK).json(why);
    } else {
      user.role = user.password === config.adminPassword ? 'admin' : 'user';
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
export async function update(req, res) {
  try {
    console.log('api/users/update/body==', req.body);

    if (!req.params || !req.params._id || !req.body) {
      const error = 'MISSING PARAMS';
      res.status(HttpStatus.BAD_REQUEST).json(error);
      throw new Error(error);
    }

    const user = req.body;

    if ((user.name && !config.regexInput.test(user.name))
      || (user.login && !config.regexInput.test(user.login))
      || (user.password && !config.regexPassword.test(user.password))
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

    if (user.likes && user.likes.length > 0) {
      user.likes.map((id, index) => user.likes[index] = ObjectId(id)); // eslint-disable-line
    }
    if (user.dislikes && user.dislikes.length > 0) {
      user.dislikes.map((id, index) => user.dislikes[index] = ObjectId(id)); // eslint-disable-line
    }

    const [resLogin, resEmail] = await Promise.all([
      usersModel.findByLogin(user.login),
      usersModel.findByEmail(user.email)
    ]);
    if (resLogin && (resLogin._id.toString() !== user._id.toString())) {
      res.status(HttpStatus.OK).json('LOGIN_USED');
    } else if (resEmail && (resEmail._id.toString() !== user._id.toString())) {
      res.status(HttpStatus.OK).json('EMAIL_USED');
    } else {
      if (user.newPassword) user.password = bcrypt.hashSync(user.newPassword, config.hashSalt);

      const userUpdated = await usersModel.update(req.params._id, _.omit(user, '_id'));
      res.status(HttpStatus.OK).json(_.omit(userUpdated, 'password'));
    }
  } catch (err) {
    console.error('/api/users/update', err);
  }
}

/**
 * (post) update user likes.
 *
 * @param {request} req - The request
 * @param {response} res - The response
 * @returns {void}
 */
export async function updateLikes(req, res) {
  try {
    console.log('api/users/updateLikes/body==', req.body);

    const schema = Joi.object().keys({
      likes: Joi.array().required(),
      userId: Joi.string().required(),
      likeUserId: Joi.string().required(),
      action: Joi.string().required()
    });
    const body = Joi.attempt(req.body, schema);

    const likes = body.likes;

    likes.map((id, index) => likes[index] = ObjectId(id)); // eslint-disable-line
    let score = 0;
    _.map(config.score, (action, key) => {
      if (body.action === key) score = action;
    });

    const [userLiked, userUpdated] = await Promise.all([
      usersModel.updateScore(body.likeUserId, score),
      usersModel.update(body.userId, { likes })
    ]);

    if (userLiked && userLiked.likes.length) {
      for (const like of userLiked.likes) {
        if (like.toString() === body.userId.toString()) {
          usersModel.updateScore(body.userId, config.score.match);
          usersModel.updateScore(body.likeUserId, config.score.match);
          handleMatch(body);
        }
      }
    }

    res.status(HttpStatus.OK).json(_.omit(userUpdated, 'password'));
  } catch (err) {
    console.error('/api/users/update', err);
  }
}

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
      if (user.historyViews && user.historyViews.length) {
        await Promise.all(user.historyViews.map(async (userId, index) => {
          user.historyViews[index] = await usersModel.findById(userId, 'login');
        }));
      }

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
      res.status(HttpStatus.OK).json(error);
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
      await Promise.all(likes.map(async (like) => {
        const user = await usersModel.findById(like);
        if (user && !_.isEmpty(user.likes)) {
          for (const userLike of user.likes) {
            if (userLike.toString() === _id) matchs.push(user);
          }
        }
      }));
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
        if (currentUser.localization && user.localization) {
          user.distance = geolib.getDistance(
            { latitude: user.localization.lat, longitude: user.localization.lng },
            { latitude: currentUser.localization.lat, longitude: currentUser.localization.lng }
          );
        }
        affinities.push(_.omit(user, 'password'));
      }
    }
    const affinitiesSorted = _.orderBy(affinities, ['distance', 'score'], ['asc', 'desc']);
    res.status(HttpStatus.OK).json({ affinities: affinitiesSorted, currentUser: _.omit(currentUser, 'password') });
  } catch (err) {
    console.error('api/users/findByAffinity', err);
  }
}

/**
 * (get) sendResetEmail.
 *
 * @param {request} req - The request
 * @param {response} res - The response
 * @returns {void}
 */
export async function sendResetEmail(req, res) {
  try {
    if (!req.params || !req.params.login) {
      const error = 'MISSING PARAMS';
      res.status(HttpStatus.BAD_REQUEST).json(error);
      throw new Error(error);
    }

    const user = await usersModel.findByLogin(req.params.login);
    if (user) {
      const hash = bcrypt.hashSync(user._id.toString(), config.hashSalt);
      const token = await jwt.sign({ idHashed: hash }, config.jwtKey);

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'matchatoulous@gmail.com',
          pass: 'matchamatcha'
        }
      });

      const mailOptions = {
        from: 'matchatoulous@gmail.com',
        to: user.email,
        subject: 'Matcha : Reset your password',
        html: `<a href="${config.resetUrl}/${user._id}/${token}">${user.login}, click here to reset your password</a>`
      };
      await transporter.sendMail(mailOptions);
    }
  } catch (err) {
    console.error('api/users/sendResetEmail', err);
  }
}

/**
 * (post) resetPassword.
 *
 * @param {request} req - The request
 * @param {response} res - The response
 * @returns {void}
 */
export async function resetPassword(req, res) {
  try {
    if (!req.params || !req.params._id || !req.body || !req.body.password) {
      const error = 'MISSING PARAMS';
      res.status(HttpStatus.BAD_REQUEST).json(error);
      throw new Error(error);
    }

    let password = req.body.password;
    if (password && !config.regexPassword.test(password)) {
      throw new Error('Regex Safety, creation impossible');
    }

    password = await bcrypt.hashSync(password, config.hashSalt);

    await usersModel.update(req.params._id, { password });
    res.status(HttpStatus.OK).json('OK');
  } catch (err) {
    console.error('api/users/sendResetEmail', err);
  }
}

/**
 * (post) delete user notification by id.
 *
 * @param {request} req - The request
 * @param {response} res - The response
 * @returns {void}
 */
export async function deleteNotification(req, res) {
  try {
    if (!req.params || !req.params._id || !req.body || !req.body.notifId) {
      const error = 'MISSING PARAMS';
      res.status(HttpStatus.BAD_REQUEST).json(error);
      throw new Error(error);
    }

    const user = await usersModel.findById(req.params._id);
    if (!user) throw new Error('USER NOT FOUND');

    const notifications = [];
    for (const notif of user.notifications) {
      if (notif._id.toString() !== req.body.notifId) {
        notifications.push(notif);
      }
    }
    user.notifications = notifications;

    const userUpdated = await usersModel.update(req.params._id, user);
    res.status(HttpStatus.OK).json(userUpdated);
  } catch (err) {
    console.error('api/users/deleteNotification', err);
  }
}

/**
 * (post) report.
 *
 * @param {request} req - The request
 * @param {response} res - The response
 * @returns {void}
 */
export async function report(req, res) {
  try {
    if (!req.body || !req.body.reported || !req.body.by) {
      const error = 'MISSING PARAMS';
      res.status(HttpStatus.BAD_REQUEST).json(error);
      throw new Error(error);
    }

    const user = await usersModel.findById(req.body.reported);
    if (!user) {
      throw new Error('USER NOT FOUN');
    }

    user.reports = user.reports || [];
    user.reports.push({ by: ObjectId(req.body.by), data: moment().format() });

    await usersModel.update(req.body.reported, user);
    res.status(HttpStatus.OK).json('OK');
  } catch (err) {
    console.error('api/users/report', err);
  }
}
