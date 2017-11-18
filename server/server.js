import { Server } from 'http';
import Express from 'express';

import appConfig from './config/app';
import routes from './api';

const app = new Express();
const server = new Server(app);

/**
 * Start the web app.
 *
 * @returns {void}
 */
export const start = async () => {
  await appConfig(app);
  await routes(app);

  await server.listen(app.get('port'));
};

/**
 * Stop the web app gracefully.
 *
 * @returns {void}
 */
export const stop = async () => {
  await new Promise((resolve, reject) => server.close(err => (err ? reject(err) : resolve())));
  // socketio.close();
};

if (!module.parent) {
  start()
    .then(() => console.info('✔ Server running on port', app.get('port')))
    .catch(err => console.error(err, '✘ An error happened'));
}
