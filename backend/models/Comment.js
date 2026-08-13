// models/Comment.js
// A separate collection (not embedded on Post) since comments carry
// their own timestamps and can grow unbounded on a popular post.
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: [true, 'Comment text is required'], trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
