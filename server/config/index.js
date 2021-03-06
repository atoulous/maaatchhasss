export default {
  db: {
    url: process.env.DB_URL || 'mongodb://localhost:27017/matcha',
    urlSafe: process.env.DB_URLSAFE || 'mongodb://localhost:27017/matchaSafe'
  },
  resetUrl: process.env.RESET_URL || 'http://localhost:3000/reset',
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  localization: { timezone: process.env.TIMEZONE || 'Europe/Paris' },
  hashSalt: process.env.HASH_SALT || 10,
  regexEmail: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  regexInput: /^[a-zA-Z0-9 _-èéêë]{3,20}$/,
  regexPassword: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
  regexAge: /^[0-9]{1,3}$/,
  adminPassword: process.env.ADMIN_PASSWORD || 'superadmin1',
  jwtKey: process.env.JWT_KEY || 'secret',
  expressSession: {
    secret: process.env.SESSION_SECRET || 'secret',
    name: process.env.SESSION_NAME || 'sessionId'
  },
  roles: {
    ADMIN: /^admin/,
    USER: /^user/,
    VISITOR: /^visitor/
  },
  mapBoxToken: process.env.MAP_BOX_TOKEN || 'pk.eyJ1IjoiYXRvdWxvdXMiLCJhIjoiY2phOXFjazU0MGYzcDJycW1hMHFpaXk5aSJ9.4quqrWw6pcSlSSBi-ZdMig',
  score: {
    chat: 1,
    like: 20,
    superLike: 40,
    match: 60
  },
  visitNotifications: !!process.env.VISIT_NOTIFICATIONS,
  authHeader42: 'Bearer 5cb9930ffda1c1b268d4b2f68c533a041456d8193ccebdde739941996004c2af'
};
