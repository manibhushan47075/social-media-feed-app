// server.js

require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
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

const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb://127.0.0.1:27017/social-media-feed-app';

const CLIENT_URL =
  process.env.CLIENT_URL ||
  'http://localhost:5176';


// -------------------------
// Middleware
// -------------------------

app.use(
  cors({
    origin: CLIENT_URL,
  })
);

app.use(express.json());


// -------------------------
// API Routes
// -------------------------

app.use('/api/auth', authRoutes);

app.use('/api/posts', postRoutes);

app.use('/api/comments', commentRoutes);


// -------------------------
// Health Check
// -------------------------

app.get('/', (req, res) => {
  res.json({
    message: 'Social Media Feed API is running',
  });
});


// -------------------------
// Error Handler
// -------------------------

app.use((err, req, res, next) => {

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message: err.message,
    });
  }

  if (err) {
    return res.status(400).json({
      message: err.message,
    });
  }

  next();
});


// -------------------------
// HTTP Server
// -------------------------

const httpServer = http.createServer(app);


// -------------------------
// Socket.IO
// -------------------------

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
  },
});


// Make Socket.IO available
// inside controllers
setIO(io);


// Register socket handlers
registerSocketHandlers(io);


// -------------------------
// MongoDB Connection
// -------------------------

mongoose
  .connect(MONGO_URI)
  .then(() => {

    console.log('MongoDB connected');

    httpServer.listen(PORT, () => {

      console.log(
        `Server running on http://localhost:${PORT}`
      );

    });

  })
  .catch((error) => {

    console.error(
      'MongoDB connection error:',
      error.message
    );

    process.exit(1);
  });