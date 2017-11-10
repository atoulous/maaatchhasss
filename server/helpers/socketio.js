const socketio = require('socket.io');

const regions = require('../../common/enum/region');
const socketEvent = require('../../common/enum/socketEvent');

let io;

/**
 * Start listening to a server instance.
 *
 * @param {Server} server - the http server instance
 * @return {socketio.Server} the io server instance
 */
function listen(server) {
  io = socketio(server);

  io.on('connection', async (socket) => {
    socket.on(socketEvent.REGION_SELECT, (region) => {
      Object.values(regions).forEach(regionKey => socket.leave(regionKey));
      socket.join(region);
    });
  });

  return io;
}

/**
 * Get the socket io connection.
 *
 * @return {socketio.Server} the io server instance
 */
function getConnection() {
  return io;
}

/**
 * Close the connection.
 *
 * @param {Function} [cb] - the callback
 */
function close(cb) {
  if (!io) {
    cb();
    return;
  }
  io.close(cb);
  io = null;
}

module.exports = {
  listen,
  close,
  getConnection
};
