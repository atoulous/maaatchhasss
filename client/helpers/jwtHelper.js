import jwt from 'jsonwebtoken';

import config from '../../server/config/index';

export async function create(context) {
  try {
    const token = await jwt.sign(
      { login: context.login, role: context.role, _id: context._id },
      config.jwtKey,
      { expiresIn: '4h' }
    );

    localStorage.setItem('auth:token', `Bearer ${token}`);

    return token;
  } catch (err) {
    throw err;
  }
}

export async function verify() {
  try {
    // console.log('Verify JWT');
    const authorization = localStorage.getItem('auth:token');
    if (!authorization) return false;

    const token = authorization.replace('Bearer ', '');

    const tokenDecoded = await jwt.verify(token, config.jwtKey);
    if (tokenDecoded.role === 'visitor') return false;

    return tokenDecoded;
  } catch (err) {
    return null;
  }
}
