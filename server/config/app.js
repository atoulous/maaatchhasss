import bodyParser from 'body-parser';
import path from 'path';
import Express from 'express';
import helmet from 'helmet';
import session from 'express-session';

import config from './';

const ROOT = path.resolve(__dirname, '../..');
const CLIENT = path.resolve(ROOT, 'client');

/** App configuration */
export default (app) => {
  app.set('port', config.port);

  /** use ejs templates */
  app.set('view engine', 'ejs');
  app.set('views', CLIENT);

  /** define the folder that will be used for static assets */
  app.use(Express.static(path.resolve(CLIENT, 'assets')));

  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
  app.use(helmet());
  app.use(session({
    secret: config.expressSession.secret,
    name: config.expressSession.name,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));
};
