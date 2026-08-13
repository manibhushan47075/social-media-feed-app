// sockets/socketHandlers.js
// Handles the lifecycle of each socket connection. The actual
// broadcasting of feed events (newPost, newComment, postLiked) happens
// inside the REST controllers via getIO().emit(...) — this file is
// just about connection/disconnection bookkeeping.
function registerSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
}

module.exports = { registerSocketHandlers };
