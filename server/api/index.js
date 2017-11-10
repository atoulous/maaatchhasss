import path from 'path';

import users from './users';

const ROOT = path.resolve(__dirname, '../..');
const CLIENT = path.resolve(ROOT, 'client');

/** routes and rendering. */
export default (app) => {
  app.use('/api/users', users);

  app.get('*', (req, res) => res.status(200).render(CLIENT));
};
