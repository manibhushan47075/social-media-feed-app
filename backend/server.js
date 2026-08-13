// server.js
// Socket.io attaches to the same underlying HTTP server as Express —
// they share one port. This is why we create an explicit `http.Server`
// instance instead of just calling app.listen() directly.
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const { setIO } = require('./sockets/io');
const { registerSocketHandlers } = require('./sockets/socketHandlers');

const app = express();
const PORT = process.env.PORT || 5040;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/social-media-feed-app';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5176';

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Social Media Feed API is running' });
});

// Multer / general error handler — clean JSON instead of a stack trace
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }
  if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
});

// Wrap the Express app in a plain HTTP server so Socket.io can attach to it
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: { origin: CLIENT_URL },
});

setIO(io); // makes `io` available to controllers via getIO()
registerSocketHandlers(io);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    httpServer.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  });
