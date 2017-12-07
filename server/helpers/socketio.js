import socketio from 'socket.io';
import { ObjectId } from 'mongodb';
import moment from 'moment-timezone';
import _ from 'lodash';

import * as usersModel from '../api/users/usersModel';

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

  return next();
}

/**
 * handle superLike socket coming
 *
 * @param {Object} data - the io data socket
 * @param {Object} socket - the io socket
 * @return {void}
 */
export async function handleSuperLike(data, socket) {
  console.log('socket/handleSuperLike/data==', data);

  const toSocketId = _.get(connections, data.to);
  const [userTo, userFrom] = await Promise.all([
    usersModel.findById(data.to),
    usersModel.findById(data.from)
  ]);

  const notifications = userTo.notifications || [];
  console.log('notifications==', notifications);

  const newNotif = {
    _id: ObjectId(),
    message: `${userFrom.login} super like you !`,
    login: userFrom.login,
    type: 'superLike'
  };

  notifications.push(newNotif);
  const { notifications: notifUpdated } = await usersModel.update(data.to, { notifications });
  socket.broadcast.to(toSocketId).emit('superLike', notifUpdated);
}

/**
 * handle chat socket coming
 *
 * @param {Object} data - the io data socket
 * @param {Object} socket - the io socket
 * @return {void}
 */
export async function handleChat(data, socket) {
  console.log('socket/handleChat/data==', data);

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
  socket.broadcast.to(toSocketId).emit('chat', notifUpdated);
  socket.broadcast.to(toSocketId).emit('message', data.chat);
}

/**
 * Start listening to a server instance.
 *
 * @param {Server} server - the http server instance
 * @return {socketio.Server} the io server instance
 */
export function listen(server) {
  io = socketio(server);

  io.use(setUserId);

  io.on('connection', (socket) => {
    console.log('connection/socket.id==', socket.id);

    socket.on('superLike', data => handleSuperLike(data, socket));
    socket.on('chat', data => handleChat(data, socket));
  });

  io.on('disconnect', (socket) => {
    console.log('socket disconnect', socket.id);
  });

  return io;
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
