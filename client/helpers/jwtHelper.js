import jwt from 'jsonwebtoken';

import config from '../../server/config';

export const create = context => jwt.sign(
  { login: context.login, role: context.role, _id: context._id },
  config.jwtKey,
  { expiresIn: '4h' }
);
