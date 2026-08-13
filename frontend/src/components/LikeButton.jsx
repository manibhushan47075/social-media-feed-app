// src/components/LikeButton.jsx
import api from '../api/axios'
import { useAuth } from '../context/AuthContext.jsx'

function LikeButton({ post }) {
  const { user } = useAuth()
  const liked = user && post.likes.includes(user.id)

  async function handleClick() {
    try {
      await api.post(`/posts/${post._id}/like`)
      // No local state update needed — the 'postLiked' socket event
      // (handled in Feed.jsx) updates every open tab, including this one.
    } catch (err) {
      // fail silently in the UI; a real app might toast this
    }
  }

  return (
    <button className={`like-btn ${liked ? 'liked' : ''}`} onClick={handleClick}>
      {liked ? '♥' : '♡'} {post.likes.length}
    </button>
  )
}

export default LikeButton
