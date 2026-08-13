// models/Post.js
// `likes` is an embedded array of User IDs — checking "did this user
// like this post" is just an array-contains check, and toggling a
// like is a single atomic update. This stays cheap at this scale;
// comments are NOT embedded here (see Comment.js) because they carry
// more data per entry and can grow unbounded on a popular post.
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: [true, 'Post text is required'], trim: true },
    image: { type: String, default: null }, // filename, served from /uploads
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
