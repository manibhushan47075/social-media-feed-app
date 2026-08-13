// routes/commentRoutes.js
// Separate from postRoutes because deleting a comment is addressed
// by the comment's own ID, not nested under a post's ID.
const express = require('express');
const router = express.Router();
const { deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.delete('/:id', protect, deleteComment);

module.exports = router;
