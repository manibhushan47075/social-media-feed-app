// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useSocket } from '../context/SocketContext.jsx'

function Navbar() {
  const { user, logout } = useAuth()
  const { connected } = useSocket()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="brand">Feed</Link>
      <div className="nav-links">
        {user ? (
          <>
            <span className={`live-dot ${connected ? 'live-on' : 'live-off'}`} title={connected ? 'Live' : 'Offline'} />
            <span className="nav-user">Hi, {user.name}</span>
            <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
