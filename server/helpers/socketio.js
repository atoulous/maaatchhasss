import socketio from 'socket.io';
import { ObjectId } from 'mongodb';
import moment from 'moment-timezone';
import _ from 'lodash';

import * as usersModel from '../api/users/usersModel';
import config from '../config';

let io;
const connections = {};

/**
 * Socket middleware:
 * fill connections[] as [userId => socketId] for matchs userId/socketId
 *
 * @param {socketio.Server} socket - the io socket
 * @param {function} next - the next middleware
 * @return {next}
 */
function setUserId(socket, next) {
  const userId = socket.handshake.query.userId;
  connections[userId] = socket.id;
  usersModel.update(userId, { online: true });

  return next();
}

/**
 * handle match notifications
 *
 * @param {Object} data - the data
 * @return {void}
 */
export async function handleMatch(data) {
  // console.log('socket/handleMatch/data==', data);

  const userSocketId = _.get(connections, data.userId);
  const userLikedSocketId = _.get(connections, data.likeUserId);
  const [user, userLiked] = await Promise.all([
    usersModel.findById(data.userId),
    usersModel.findById(data.likeUserId)
  ]);

  const userNotifications = user.notifications || [];
  const userLikedNotifications = userLiked.notifications || [];

  const userNotif = {
    _id: ObjectId(),
    message: `You match with ${userLiked.login} !`,
    login: userLiked.login,
    type: 'match'
  };
  const likedNotif = {
    _id: ObjectId(),
    message: `You match with ${user.login} !`,
    login: user.login,
    type: 'match'
  };

  userNotifications.push(userNotif);
  userLikedNotifications.push(likedNotif);
  const [{ notifications: notifUserUp },
    { notifications: notifLikedUp }] = await Promise.all([
      usersModel.update(data.userId, { notifications: userNotifications }),
      usersModel.update(data.likeUserId, { notifications: userLikedNotifications })
    ]);
  io.sockets.to(userSocketId).emit('match', notifUserUp);
  io.sockets.to(userLikedSocketId).emit('match', notifLikedUp);
}

/**
 * handle superLike socket coming
 *
 * @param {Object} data - the io data socket
 * @param {Object} socket - the io socket
 * @return {void}
 */
export async function handleSuperLike(data) {
  // console.log('socket/handleSuperLike/data==', data);

  const toSocketId = _.get(connections, data.to);
  const [userTo, userFrom] = await Promise.all([
    usersModel.findById(data.to),
    usersModel.findById(data.from)
  ]);

  const notifications = userTo.notifications || [];

  const newNotif = {
    _id: ObjectId(),
    message: `${userFrom.login} super like you !`,
    login: userFrom.login,
    type: 'superLike'
  };

  notifications.push(newNotif);
  const { notifications: notifUpdated } = await usersModel.update(data.to, { notifications });
  io.sockets.to(toSocketId).emit('superLike', notifUpdated);
}

/**
 * handle chat socket coming
 *
 * @param {Object} data - the io data socket
 * @param {Object} socket - the io socket
 * @return {void}
 */
export async function handleChat(data) {
  // console.log('socket/handleChat/data==', data);

  const toSocketId = _.get(connections, data.to);
  const [userTo, userFrom] = await Promise.all([
    usersModel.findById(data.to),
    usersModel.findById(data.from)
  ]);

  const notifications = userTo.notifications || [];

  const newNotif = {
    _id: ObjectId(),
    message: `${userFrom.login} send you a message !`,
    login: userFrom.login,
    type: 'chat',
    date: moment().format()
  };

  notifications.push(newNotif);
  const { notifications: notifUpdated } = await usersModel.update(data.to, { notifications });
  io.sockets.to(toSocketId).emit('chat', { notifs: notifUpdated, newNotif });
  io.sockets.to(toSocketId).emit('message', data.chat);
}

/**
 * handle dislike socket coming
 *
 * @param {Object} data - the io data socket
 * @param {Object} socket - the io socket
 * @return {void}
 */
export async function handleDislike(data) {
  // console.log('socket/handleDislike/data==', data);

  const toSocketId = _.get(connections, data.to);
  const [userTo, userFrom] = await Promise.all([
    usersModel.findById(data.to),
    usersModel.findById(data.from)
  ]);

  const notifications = userTo.notifications || [];

  const newNotif = {
    _id: ObjectId(),
    message: `${userFrom.login} remove you :'(`,
    login: userFrom.login,
    type: 'dislike',
    date: moment().format()
  };

  notifications.push(newNotif);
  const { notifications: notifUpdated } = await usersModel.update(data.to, { notifications });
  io.sockets.to(toSocketId).emit('dislike', notifUpdated);
}


/**
 * handle visit socket coming
 *
 * @param {Object} data - the io data socket
 * @param {Object} socket - the io socket
 * @return {void}
 */
export async function handleVisit(data) {
  // console.log('socket/handleVisit/data==', data);

  const toSocketId = _.get(connections, data.to);
  const [userTo, userFrom] = await Promise.all([
    usersModel.findById(data.to),
    usersModel.findById(data.from)
  ]);

  // save view profil history
  const historyViews = userTo.historyViews || [];
  historyViews.push(data.from);
  await usersModel.update(data.to, { historyViews });

  if (!config.visitNotifications) return;

  const notifications = userTo.notifications || [];

  const newNotif = {
    _id: ObjectId(),
    message: `${userFrom.login} has seen your profil`,
    login: userFrom.login,
    type: 'visit',
    date: moment().format()
  };

  notifications.push(newNotif);
  const { notifications: notifUpdated } = await usersModel.update(data.to, { notifications });
  io.sockets.to(toSocketId).emit('visit', notifUpdated);
}

/**
 * Start listening to a server instance.
 *
 * @param {Server} server - the http server instance
 * @return {socketio.Server} the io server instance
 */
export function listen(server) {
  try {
    io = socketio(server);

    io.use(setUserId);

    io.on('connection', (socket) => {
      socket.on('superLike', data => handleSuperLike(data));
      socket.on('chat', data => handleChat(data));
      socket.on('dislike', data => handleDislike(data));
      socket.on('visit', data => handleVisit(data));

      socket.on('disconnect', async () => {
        const cos = _.invert(connections);
        const userId = _.get(cos, socket.id);
        if (userId) {
          await usersModel.update(userId, { online: false });
        }
      });
    });

    return io;
  } catch (err) {
    console.error('socketio/listen', err);
    return null;
  }
}

/**
 * Close the connection.
 *
 * @return {void}
 */
export function close() {
  if (io) {
    io.close();
    io = null;
  }
}

/**
 * Get the socket io connection.
 *
 * @return {socketio.Server} the io server instance
 */
export function getConnection() {
  return io;
}
