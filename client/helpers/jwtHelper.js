import jwt from 'jsonwebtoken';

import config from '../../server/config/index';

export const create = async (context) => {
  try {
    const token = await jwt.sign(
      { login: context.login, role: context.role, _id: context._id },
      config.jwtKey,
      { expiresIn: '4h' }
    );
    localStorage.setItem('connected', 'true');
    localStorage.setItem('auth:token', `Bearer ${token}`);

    return token;
  } catch (err) {
    throw new Error(err);
  }
};

export const verify = async () => {
  try {
    const authorization = localStorage.getItem('auth:token');
    if (!authorization) throw new Error('No auth:token');

    const token = authorization.replace('Bearer ', '');

    const decoded = await jwt.verify(token, config.jwtKey);
    if (decoded.role === 'visitor') throw new Error('visitor');

    return decoded;
  } catch (err) {
    throw err;
  }
};
