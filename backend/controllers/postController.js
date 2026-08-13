// controllers/postController.js
const Post = require('../models/Post');
const { getIO } = require('../sockets/io');

// GET /api/posts — everyone's posts, newest first (a public feed)
async function getPosts(req, res) {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'name email');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch posts', error: error.message });
  }
}

// GET /api/posts/:id
async function getPostById(req, res) {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch post', error: error.message });
  }
}

// POST /api/posts — protected. Image is optional (via Multer, req.file).
async function createPost(req, res) {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Post text is required' });

    const post = await Post.create({
      author: req.user.id,
      text,
      image: req.file ? req.file.filename : null,
    });

    const populatedPost = await post.populate('author', 'name email');

    // Broadcast to every connected client so their feed updates live.
    getIO().emit('newPost', populatedPost);

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create post', error: error.message });
  }
}

// DELETE /api/posts/:id — protected, only the post's own author can delete it
async function deletePost(req, res) {
  try {
    const post = await Post.findOne({ _id: req.params.id, author: req.user.id });
    if (!post) return res.status(404).json({ message: 'Post not found' });

    await post.deleteOne();

    getIO().emit('postDeleted', { postId: req.params.id });

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete post', error: error.message });
  }
}

// POST /api/posts/:id/like — protected. Toggles the current user's like.
async function toggleLike(req, res) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user.id;
    const alreadyLiked = post.likes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    const payload = { postId: post._id, likes: post.likes };
    getIO().emit('postLiked', payload);

    res.status(200).json(payload);
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle like', error: error.message });
  }
}

module.exports = { getPosts, getPostById, createPost, deletePost, toggleLike };
