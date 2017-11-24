import { Server } from 'http';
import Express from 'express';
import moment from 'moment-timezone';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpack from 'webpack';
import chokidar from 'chokidar';
import path from 'path';

import appConfig from './config/app';
import routes from './api';
import config from './config/index';
import webpackConfig from './../webpack.config.babel';

const app = new Express();
const server = new Server(app);
const compiler = webpack(webpackConfig);

moment.tz.setDefault(config.localization.timezone);

/**
 * Start the web app.
 *
 * @returns {void}
 */
export const start = async () => {
/*
  // app.use(webpackDevMiddleware(compiler, {
  //   noInfo: true, publicPath: webpackConfig.output.publicPath
  // }));
  // app.use(webpackHotMiddleware(compiler));

  // Do "hot-reloading" of express stuff on the server
  // Throw away cached modules and re-require next time
  // Ensure there's no important state in there!
  const watcher = chokidar.watch(path.join(__dirname, 'api'));

  watcher.on('ready', () => {
    watcher.on('all', () => {
      console.log('Clearing /server/ module cache from server');
      Object.keys(require.cache).forEach((id) => {
        if (/[\/\\]api[\/\\]/.test(id)) delete require.cache[id];
      });
    });
  });

  // Do "hot-reloading" of react stuff on the server
  // Throw away the cached client modules and let them be re-required next time
  compiler.plugin('done', () => {
    console.log('Clearing /client/ module cache from server');
    Object.keys(require.cache).forEach((id) => {
      if (/[\/\\]client[\/\\]/.test(id)) delete require.cache[id];
    });
  });
*/
  appConfig(app);
  routes(app);

  return server.listen(app.get('port'));
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
