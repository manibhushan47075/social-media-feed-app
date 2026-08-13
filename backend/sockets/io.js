// sockets/io.js
// A tiny singleton so controllers can emit events (e.g. `newPost`)
// without needing to import server.js directly, which would create
// a circular dependency (server.js also imports the controllers'
// routes). server.js calls setIO() once at startup; controllers call
// getIO() whenever they need to broadcast something.
let ioInstance = null;

function setIO(io) {
  ioInstance = io;
}

function getIO() {
  if (!ioInstance) {
    throw new Error('Socket.io has not been initialized yet');
  }
  return ioInstance;
}

module.exports = { setIO, getIO };
