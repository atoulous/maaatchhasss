import bcrypt from 'bcrypt';
import * as HttpStatus from 'http-status-codes';

import * as usersModel from './usersModel';
import config from '../../config';

/**
 * Log in a user.
 *
 * @param {request} req - The request
 * @param {response} res - The response
 * @returns {void}
 */
export async function login(req, res) {
  try {
    // check if the user is on database
    const user = await usersModel.findByLogin({ login: req.body.login });

    // else return NOT_FOUND (404)
    if (!user) res.sendStatus(HttpStatus.NOT_FOUND);

    // hashing pwd
    const hash = bcrypt.hashSync(req.body.password, config.hashSalt);

    // then check if password is the good one and return OK (200), else return UNAUTHORIZED (401)
    if (bcrypt.compareSync(user.password, hash)) {
      res.sendStatus(HttpStatus.OK);
    } else {
      res.sendStatus(HttpStatus.UNAUTHORIZED);
    }
  } catch (err) {
    throw new Error({ err }, 'api/users/login');
  }
}

/**
 * Create a user.
 *
 * @param {request} req - The request
 * @param {response} res - The response
 * @returns {void}
 */
export async function create(req, res) {
  try {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, config.hashSalt);
    await usersModel.insertOne(user);

    // return CREATED (201)
    res.sendStatus(HttpStatus.CREATED);
  } catch (err) {
    throw new Error({ err }, 'api/users/create');
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

    // return OK (200) and all users found
    res.status(HttpStatus.OK);
    res.json(users);
  } catch (err) {
    throw new Error({ err }, 'api/users/findAll');
  }
}
