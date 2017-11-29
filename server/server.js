import { Server } from 'http';
import Express from 'express';
import moment from 'moment-timezone';

import appConfig from './config/app';
import routes from './api';
import config from './config/index';
import * as socketio from './helpers/socketio';

const app = Express();
const server = Server(app);

moment.tz.setDefault(config.localization.timezone);

/**
 * Start the web app.
 *
 * @returns {void}
 */
export async function start() {
  appConfig(app);
  routes(app);
  socketio.listen(server);

  return server.listen(app.get('port'));
}

/**
 * Stop the web app gracefully.
 *
 * @returns {void}
 */
export async function stop() {
  await new Promise((resolve, reject) => server.close(err => (err ? reject(err) : resolve())));
  socketio.close();
}

if (!module.parent) {
  start()
    .then(() => console.info('✔ Server running on port', app.get('port')))
    .catch(err => console.error(err, '✘ An error happened'));
}
