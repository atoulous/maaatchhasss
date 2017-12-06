import socketio from 'socket.io';
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
  // console.log('socket/handleSuperLike/data==', data, socket.id);

  const toSocketId = _.get(connections, data.to);
  const login = await usersModel.findById(data.from, 'login');

  const notif = `${login} super like you !`;
  socket.broadcast.to(toSocketId).emit('superLike', notif);
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
