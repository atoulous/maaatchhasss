import path from 'path';
import { Server } from 'http';
import Express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import config from './config';
import users from './api/users';

const app = new Express();
const server = new Server(app);

const ROOT = path.resolve(__dirname, '..');
const CLIENT = path.resolve(ROOT, 'client');

// use ejs templates
app.set('view engine', 'ejs');
app.set('views', CLIENT);

// define the folder that will be used for static assets
app.use(Express.static(path.resolve(CLIENT, 'assets')));

// The authorization code flows are stateful - they use a session to
// store user state (vs. relying solely on an id_token or access_token)
app.use(cookieParser());
app.use(session({
  secret: 'AlwaysOn',
  cookie: { maxAge: 3600000 },
  resave: false,
  saveUninitialized: false,
}));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// routes and rendering
app.use('/api/users', users);
app.get('*', (req, res) => res.status(200).render(path.resolve(CLIENT, 'index')));

// start the server
server.listen(config.port, (err) => {
  if (err) return console.error(err);
  return console.info(`Server running on http://localhost:${config.port} [${config.env}]`);
});
