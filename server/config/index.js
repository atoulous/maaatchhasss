export const config = {
  db: {
    url: 'mongodb://localhost:27017/matcha'
  },
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  localization: { timezone: 'Europe/Paris' },
  hashSalt: 10,
  regexEmail: /^[a-zA-Z0-9._-]*@[a-zA-Z0-9_-]*([.]{1}[a-z]+){1,}$/,
  regexInput: /^[a-zA-Z0-9 _-]{3,20}$/,
  regexPassword: /^[a-zA-Z0-9 _-]{6,18}$/,
  adminPassword: 'superadmin',
  jwtKey: 'secret',
  expressSession: {
    secret: 'secret',
    name: 'sessionId'
  },
  roles: {
    ADMIN: /^admin/,
    USER: /^user/,
    VISITOR: /^visitor/
  }
};

export default config;
