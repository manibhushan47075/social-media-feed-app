// src/components/PostComposer.jsx
// Creates a post via the REST endpoint. The live broadcast to every
// connected client (including this one) happens server-side as a
// side effect of that request — this component doesn't need to touch
// sockets directly at all.

import { useRef, useState } from 'react'
import api from '../api/axios'

function PostComposer() {
  const [text, setText] = useState('')
  const [image, setImage] = useState(null)
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState('')

  // Reference to the actual file input element
  const fileInputRef = useRef(null)

  async function handleSubmit(event) {
    event.preventDefault()

    if (!text.trim()) return

    const formData = new FormData()
    formData.append('text', text)

    if (image) {
      formData.append('image', image)
    }

    try {
      setPosting(true)
      setError('')

      await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      // Clear text
      setText('')

      // Clear selected image from React state
      setImage(null)

      // Clear the actual browser file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      // No need to manually add the post to the feed here —
      // the 'newPost' socket event (received by Feed.jsx) does that,
      // for this browser tab exactly the same as any other tab.
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post')
    } finally {
      setPosting(false)
    }
  }

  return (
    <form className="composer" onSubmit={handleSubmit}>
      <textarea
        placeholder="What's on your mind?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        required
      />

      <div className="composer-footer">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0] || null)}
        />

        <button
          type="submit"
          className="btn btn-primary"
          disabled={posting}
        >
          {posting ? 'Posting...' : 'Post'}
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}
    </form>
  )
}

export default PostComposer