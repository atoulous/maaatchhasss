import socketio from 'socket.io';

import * as chatsController from '../api/chats/chatsController';

let io;

/**
 * Start listening to a server instance.
 *
 * @param {Server} server - the http server instance
 * @return {socketio.Server} the io server instance
 */
export function listen(server) {
  io = socketio(server);

  io.on('connection', (socket) => {
    socket.on('chat', async (chat) => {
      console.log('socket/chatReceived==', chat);
      chatsController.receivedChat(chat);
    });
  });
  return io;
}

/**
 * Close the connection.
 *
 * @param {Function} [cb] - the callback
 */
export function close(cb) {
  if (!io) {
    cb();
    return;
  }
  io.close(cb);
  io = null;
}

/**
 * Get the socket io connection.
 *
 * @return {socketio.Server} the io server instance
 */
export default function getConnection() {
  return io;
}
