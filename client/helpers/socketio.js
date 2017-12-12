import io from 'socket.io-client';

let client;

/**
 * Get the socket io client.
 *
 * @return {socketio.client} the io client instance
 */
export function getSocketClient(userId) {
  if (client) return client;
  client = io.connect('/', { query: { userId } });

  return client;
}
