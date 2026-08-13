// controllers/commentController.js
const Comment = require('../models/Comment');
const { getIO } = require('../sockets/io');

// GET /api/posts/:postId/comments
async function getComments(req, res) {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .sort({ createdAt: 1 })
      .populate('author', 'name email');
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch comments', error: error.message });
  }
}

// POST /api/posts/:postId/comments — protected
async function createComment(req, res) {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text is required' });

    const comment = await Comment.create({
      post: req.params.postId,
      author: req.user.id,
      text,
    });

    const populatedComment = await comment.populate('author', 'name email');

    getIO().emit('newComment', populatedComment);

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create comment', error: error.message });
  }
}

// DELETE /api/comments/:id — protected, only the comment's own author can delete it
async function deleteComment(req, res) {
  try {
    const comment = await Comment.findOne({ _id: req.params.id, author: req.user.id });
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    await comment.deleteOne();

    getIO().emit('commentDeleted', { commentId: req.params.id, postId: comment.post });

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete comment', error: error.message });
  }
}

module.exports = { getComments, createComment, deleteComment };
