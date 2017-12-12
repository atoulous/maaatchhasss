export const config = {
  db: {
    url: 'mongodb://localhost:27017/matcha',
    urlSafe: 'mongodb://localhost:27017/matchaSafe'
  },
  resetUrl: process.env.RESET_URL || 'http://localhost:3000/reset',
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  localization: { timezone: 'Europe/Paris' },
  hashSalt: 10,
  regexEmail: /^[a-zA-Z0-9._-]*@[a-zA-Z0-9_-]*([.]{1}[a-z]+){1,}$/,
  regexInput: /^[a-zA-Z0-9 _-èéêë]{3,20}$/,
  regexPassword: /^[a-zA-Z0-9 _-]{6,18}$/,
  // regexPassword: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
  regexAge: /^[0-9]{1,3}$/,
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
  },
  mapBoxToken: 'pk.eyJ1IjoiYXRvdWxvdXMiLCJhIjoiY2phOXFjazU0MGYzcDJycW1hMHFpaXk5aSJ9.4quqrWw6pcSlSSBi-ZdMig',
  score: {
    chat: 1,
    like: 20,
    superLike: 40,
    match: 60
  }
};

export default config;
