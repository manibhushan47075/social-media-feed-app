// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPostById,
  createPost,
  deletePost,
  toggleLike,
} = require('../controllers/postController');
const { getComments, createComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public: anyone can view the feed
router.get('/', getPosts);
router.get('/:id', getPostById);

// Protected: creating/deleting/liking requires a logged-in user
router.post('/', protect, upload.single('image'), createPost);
router.delete('/:id', protect, deletePost);
router.post('/:id/like', protect, toggleLike);

// Comments, nested under a post
router.get('/:postId/comments', getComments);
router.post('/:postId/comments', protect, createComment);

module.exports = router;
