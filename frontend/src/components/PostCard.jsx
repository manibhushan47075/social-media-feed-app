// src/components/PostCard.jsx

import { useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext.jsx'
import LikeButton from './LikeButton.jsx'
import CommentList from './CommentList.jsx'


function PostCard({ post, onDelete }) {
  const { user } = useAuth()
  const [showComments, setShowComments] = useState(false)


  // Normal user can delete their own post.
  // Admin can delete any post.
  const isOwnPost =
    user && post.author?._id === user.id

  const isAdmin =
    user?.isAdmin === true


  async function handleDelete() {
    try {
      await api.delete(`/posts/${post._id}`)

      // The postDeleted socket event
      // removes the post from the feed everywhere.

    } catch (err) {
      console.error(
        'Failed to delete post:',
        err
      )
    }
  }


  return (
    <div className="post-card">

      <div className="post-head">

        <span className="post-author">
          {post.author?.name || 'Unknown'}
        </span>

        <span className="post-time">
          {new Date(post.createdAt).toLocaleString()}
        </span>

      </div>


      <p className="post-text">
        {post.text}
      </p>


      {/* Cloudinary image */}
      {post.image && (
        <img
          className="post-image"
          src={post.image}
          alt="Post attachment"
        />
      )}


      <div className="post-actions">

        <LikeButton post={post} />


        <button
          className="btn btn-ghost-sm"
          onClick={() =>
            setShowComments((s) => !s)
          }
        >
          {showComments
            ? 'Hide comments'
            : 'Comments'}
        </button>


        {/* Owner OR Admin can delete */}
        {(isOwnPost || isAdmin) && (
          <button
            className="btn btn-danger-sm"
            onClick={handleDelete}
          >
            Delete
          </button>
        )}

      </div>


      {showComments && (
        <CommentList postId={post._id} />
      )}

    </div>
  )
}


export default PostCard