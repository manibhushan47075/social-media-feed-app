// src/pages/Feed.jsx
// The initial post list always loads via a normal REST GET (sockets
// have no history — they only deliver events that happen while
// connected). From that point on, 'newPost', 'postDeleted', and
// 'postLiked' events keep the list in sync live, without polling.
import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useSocket } from '../context/SocketContext.jsx'
import PostComposer from '../components/PostComposer.jsx'
import PostCard from '../components/PostCard.jsx'

function Feed() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { socket } = useSocket()

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    if (!socket) return

    function handleNewPost(post) {
      setPosts((prev) => [post, ...prev])
    }

    function handlePostDeleted({ postId }) {
      setPosts((prev) => prev.filter((p) => p._id !== postId))
    }

    function handlePostLiked({ postId, likes }) {
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? { ...p, likes } : p))
      )
    }

    socket.on('newPost', handleNewPost)
    socket.on('postDeleted', handlePostDeleted)
    socket.on('postLiked', handlePostLiked)

    return () => {
      socket.off('newPost', handleNewPost)
      socket.off('postDeleted', handlePostDeleted)
      socket.off('postLiked', handlePostLiked)
    }
  }, [socket])

  async function fetchPosts() {
    try {
      setLoading(true)
      const { data } = await api.get('/posts')
      setPosts(data)
    } catch (err) {
      setError('Failed to load feed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="feed-page">
      <PostComposer />

      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <p>Loading feed...</p>
      ) : posts.length === 0 ? (
        <p className="empty-state">No posts yet — be the first to post.</p>
      ) : (
        <div className="feed-list">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Feed
