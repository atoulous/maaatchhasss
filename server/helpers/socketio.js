import socketio from 'socket.io';

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
    socket.on('message', (msg) => {
      console.log('socket/listen/co==', msg);
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
