// src/components/CommentList.jsx
// Fetches this post's comments on mount, and listens for 'newComment'
// events scoped to this post so new comments appear live without a
// page refresh, whether they came from this tab or another user's.
import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useSocket } from '../context/SocketContext.jsx'

function CommentList({ postId }) {
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const { socket } = useSocket()

  useEffect(() => {
    fetchComments()
  }, [postId])

  useEffect(() => {
    if (!socket) return

    function handleNewComment(comment) {
      if (comment.post === postId) {
        setComments((prev) => [...prev, comment])
      }
    }

    socket.on('newComment', handleNewComment)
    return () => socket.off('newComment', handleNewComment)
  }, [socket, postId])

  async function fetchComments() {
    try {
      const { data } = await api.get(`/posts/${postId}/comments`)
      setComments(data)
    } catch (err) {
      // ignore for now
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!text.trim()) return

    try {
      await api.post(`/posts/${postId}/comments`, { text })
      setText('')
      // the new comment arrives via the 'newComment' socket event above
    } catch (err) {
      // ignore for now
    }
  }

  return (
    <div className="comments">
      {comments.map((comment) => (
        <p key={comment._id} className="comment">
          <strong>{comment.author?.name || 'Unknown'}:</strong> {comment.text}
        </p>
      ))}
      <form className="comment-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="btn btn-ghost-sm">Send</button>
      </form>
    </div>
  )
}

export default CommentList
