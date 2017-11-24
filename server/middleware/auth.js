import _ from 'lodash';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';

import config from '../config/index';

/**
 * Express middleware that checks authentication token
 * @param {Object} req Express request
 * @param {Object} res Express result
 * @param {Object} next Express next middleware
 * @returns {function} next
 */
export function authMiddleware(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) throw createError.Unauthorized('No header authorization');

  const token = authorization.replace('Bearer ', '');
  if (!token) throw createError.Unauthorized('No token found');

  let payload;
  try {
    payload = jwt.verify(token, config.jwtKey);
  } catch (err) {
    throw createError.Unauthorized(err.message);
  }

  req.user = payload;

  return next();
}

/**
 * Function that returns a restriction middleware.
 *
 * @param {Role|String[]} roles - An array of roles (string)
 * @returns {function} The middleware function that checks that the user has the allowed roles
 */
export function restrictTo(...roles) {
  return function restrictToMiddleware(req, res, next) {
    if (!req.user || _.isEmpty(req.user.role)) {
      throw createError.Unauthorized();
    }
    const userRole = req.user.role;
    if (!roles.some(role => role.test(userRole))) {
      throw createError.Forbidden();
    }

    return next();
  };
}
