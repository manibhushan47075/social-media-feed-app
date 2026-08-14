// controllers/postController.js

const Post = require('../models/Post');
const { getIO } = require('../sockets/io');
const cloudinary = require('../cloudinary');


// GET /api/posts — everyone's posts, newest first (public feed)
async function getPosts(req, res) {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'name email');

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch posts',
      error: error.message,
    });
  }
}


// GET /api/posts/:id
async function getPostById(req, res) {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email');

    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch post',
      error: error.message,
    });
  }
}


// POST /api/posts — protected
// Image is optional and is uploaded to Cloudinary
async function createPost(req, res) {
  try {
    const { text } = req.body;

    // Check post text
    if (!text) {
      return res.status(400).json({
        message: 'Post text is required',
      });
    }

    let imageUrl = null;

    // If user selected an image
    if (req.file) {
      try {
        // Upload image buffer to Cloudinary
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'social-media-feed',
              resource_type: 'image',
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

          uploadStream.end(req.file.buffer);
        });

        // Cloudinary permanent HTTPS URL
        imageUrl = result.secure_url;

      } catch (uploadError) {
        console.error(
          'Cloudinary upload error:',
          uploadError
        );

        return res.status(500).json({
          message: 'Failed to upload image',
          error: uploadError.message,
        });
      }
    }

    // Create post in MongoDB
    const post = await Post.create({
      author: req.user.id,
      text,
      image: imageUrl,
    });

    // Populate author information
    const populatedPost = await post.populate(
      'author',
      'name email'
    );

    // Broadcast new post to all connected clients
    getIO().emit('newPost', populatedPost);

    res.status(201).json(populatedPost);

  } catch (error) {
    console.error('Create post error:', error);

    res.status(500).json({
      message: 'Failed to create post',
      error: error.message,
    });
  }
}


// DELETE /api/posts/:id
// Normal user: can delete only their own post
// Admin: can delete any post
async function deletePost(req, res) {
  try {
    // Find the post by ID
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }

    // Check whether the logged-in user owns the post
    const isOwner =
      post.author.toString() === req.user.id.toString();

    // Check whether the logged-in user is an admin
    const isAdmin = req.user.isAdmin === true;

    // Allow deletion if:
    // 1. The user owns the post
    // OR
    // 2. The user is an admin
    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: 'You are not allowed to delete this post',
      });
    }

    // Delete the post
    await post.deleteOne();

    // Tell all connected clients that this post was deleted
    getIO().emit('postDeleted', {
      postId: req.params.id,
    });

    res.status(200).json({
      message: 'Post deleted successfully',
    });

  } catch (error) {
    console.error('Delete post error:', error);

    res.status(500).json({
      message: 'Failed to delete post',
      error: error.message,
    });
  }
}


// POST /api/posts/:id/like
// Protected — toggles current user's like
async function toggleLike(req, res) {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }

    const userId = req.user.id;

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId
    );

    if (alreadyLiked) {
      // Remove user's like
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      // Add user's like
      post.likes.push(userId);
    }

    await post.save();

    const payload = {
      postId: post._id,
      likes: post.likes,
    };

    // Broadcast updated likes
    getIO().emit('postLiked', payload);

    res.status(200).json(payload);

  } catch (error) {
    res.status(500).json({
      message: 'Failed to toggle like',
      error: error.message,
    });
  }
}


// Export controller functions
module.exports = {
  getPosts,
  getPostById,
  createPost,
  deletePost,
  toggleLike,
};