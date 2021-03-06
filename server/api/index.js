import path from 'path';

import users from './users';
import tags from './tags';
import chats from './chats';

const ROOT = path.resolve(__dirname, '../..');
const CLIENT = path.resolve(ROOT, 'client');

/** routes and rendering. */
export default (app) => {
  app.use('/api/users', users);
  app.use('/api/tags', tags);
  app.use('/api/chats', chats);

  app.get('*', (req, res) => res.status(200).render(CLIENT));
};
