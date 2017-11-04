export const config = {
  db: {
    url: 'mongodb://localhost:27017/matcha'
  },
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  hashSalt: 10
};

export default config;
