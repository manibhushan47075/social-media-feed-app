// models/Post.js

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    text: {
      type: String,
      required: [true, 'Post text is required'],
      trim: true,
    },

    // Cloudinary image URL
    image: {
      type: String,
      default: null,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Post', postSchema);