// src/components/PostCard.jsx
import { useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext.jsx'
import LikeButton from './LikeButton.jsx'
import CommentList from './CommentList.jsx'

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5040/api').replace('/api', '')

function PostCard({ post, onDelete }) {
  const { user } = useAuth()
  const [showComments, setShowComments] = useState(false)
  const isOwnPost = user && post.author?._id === user.id

  async function handleDelete() {
    try {
      await api.delete(`/posts/${post._id}`)
      // the 'postDeleted' socket event (handled in Feed.jsx) removes it everywhere
    } catch (err) {
      // ignore for now
    }
  }

  return (
    <div className="post-card">
      <div className="post-head">
        <span className="post-author">{post.author?.name || 'Unknown'}</span>
        <span className="post-time">{new Date(post.createdAt).toLocaleString()}</span>
      </div>

      <p className="post-text">{post.text}</p>

      {post.image && (
        <img className="post-image" src={`${API_BASE}/uploads/${post.image}`} alt="Post attachment" />
      )}

      <div className="post-actions">
        <LikeButton post={post} />
        <button className="btn btn-ghost-sm" onClick={() => setShowComments((s) => !s)}>
          {showComments ? 'Hide comments' : 'Comments'}
        </button>
        {isOwnPost && (
          <button className="btn btn-danger-sm" onClick={handleDelete}>
            Delete
          </button>
        )}
      </div>

      {showComments && <CommentList postId={post._id} />}
    </div>
  )
}

export default PostCard
