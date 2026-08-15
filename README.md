# 🚀 Social Media Feed App

A full-stack **real-time social media feed application** — users can create and interact with posts while receiving **live updates across multiple connected users, without refreshing the page.**

> 💡 **Create. Share. Like. Comment. Connect. — All in real time. ⚡**

---

## 👨‍💻 Developer

**Mani Bhushan**
B.Tech Computer Science & Engineering
ITER, Siksha 'O' Anusandhan University
2024–2028

---

## 🔗 Live Demo

**App:** [https://social-media-feed-app-theta.vercel.app/]

> The backend is a REST + Socket.io API with no browser UI of its own (it just returns a JSON health check at its root) — the link above is the actual app to visit and use.

---

## ✨ Features

### 🔐 Authentication & Security

- User registration and login
- JWT-based authentication
- Password hashing using bcrypt
- Protected routes for authenticated users
- Role-based admin authorization
- User-specific authorization for posts and comments

### 📝 Social Feed

- Create text-based posts
- Upload optional images with posts (stored on Cloudinary)
- View posts in a live, shared feed
- Delete your own posts
- Admins can delete **any** post (moderation)

### ❤️ Post Interactions

- Like / unlike posts
- Real-time like count updates
- Comment on posts
- Real-time comment updates

### ⚡ Real-Time Updates

One of the main highlights of this project is its **real-time functionality using Socket.io**.

When one user performs an action, every other connected user sees the change immediately — no refresh required.

Real-time updates include:

- 🆕 New posts
- ❤️ Likes / unlikes
- 💬 New comments
- 🗑️ Deleted posts

---

## 🧠 How It Works

The application runs two communication layers side by side:

### 1️⃣ REST API

Handles normal request/response operations:

```text
Login · Register · Create Post · Delete Post
Like Post · Create Comment · Fetch Feed
```

### 2️⃣ Socket.io

Handles **broadcasting**. After the backend successfully processes an action via REST, it emits an event to every connected client — so users see what others are doing without polling or refreshing.

```text
User A
   │ Creates a post
   ▼
REST API → Backend → Socket.io broadcast
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
   User B sees it        User C sees it        User D sees it
      instantly              instantly              instantly
```

---

## 🏗️ Project Architecture

```text
                    ┌─────────────────────┐
                    │      React App      │
                    │      Frontend       │
                    └──────────┬──────────┘
                               │
                    REST API + Socket.io
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Node + Express   │
                    │      Backend        │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    ▼                     ▼
          ┌─────────────────┐   ┌─────────────────┐
          │     MongoDB     │   │    Cloudinary   │
          │     Database    │   │  Image Storage  │
          └─────────────────┘   └─────────────────┘
```

---

## 📁 Project Structure

```text
social-media-feed-app/
│
├── backend/
│   ├── controllers/
│   ├── middleware/       # auth, admin, upload
│   ├── models/
│   ├── routes/
│   ├── sockets/
│   ├── uploads/
│   ├── cloudinary.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/      # AuthContext, SocketContext
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── vercel.json
│   ├── vite.config.js
│   └── .env.example
│
└── docs/
    └── screenshots/
```

---

## 🛠️ Tech Stack

**Frontend:** React · Vite · React Router · Socket.io Client · Axios

**Backend:** Node.js · Express.js · MongoDB · Mongoose · JWT · bcryptjs · Socket.io · Multer · Cloudinary

**Deployment:** Vercel (frontend) · Render (backend) · MongoDB Atlas (database) · Cloudinary (image storage)

---

## 🔌 API Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Create a new account |
| POST | `/api/auth/login` | ❌ | Login and receive a JWT |
| GET | `/api/posts` | ❌ | Fetch the feed |
| POST | `/api/posts` | ✅ | Create a post |
| DELETE | `/api/posts/:id` | ✅ | Delete a post (own post, or any post if admin) |
| POST | `/api/posts/:id/like` | ✅ | Like / unlike a post |
| GET | `/api/posts/:postId/comments` | ❌ | Fetch comments |
| POST | `/api/posts/:postId/comments` | ✅ | Add a comment |

---

## 🧪 Testing Real-Time Features

Postman can't show you a live broadcast — you need two browser tabs:

1. Open the app in two browser tabs (or one regular + one incognito)
2. Log in with two **different** accounts
3. Create a post from **Browser A**
4. Watch **Browser B** — the post appears automatically, no refresh
5. Try liking or commenting from either tab — changes reflect live in both

---

## 🚀 Running the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/manibhushan47075/social-media-feed-app.git
cd social-media-feed-app
```

### 2. Start the backend

```bash
cd backend
npm install
cp .env.example .env   # fill in your own values
npm run dev
```
Runs on `http://localhost:5040`

### 3. Start the frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Runs on `http://localhost:5176`

---

## 🔑 Environment Variables

Kept out of the repository for security — see each `.env.example` for the full list.

**Backend**
```env
PORT=
MONGO_URI=
JWT_SECRET=
CLIENT_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

**Frontend**
```env
VITE_API_URL=
VITE_SOCKET_URL=
```

> ⚠️ Never commit your actual `.env` files or secret keys to GitHub.

---

## 🌐 Deployment Architecture

```text
                         GitHub
                           │
                ┌──────────┴──────────┐
                ▼                     ▼
             Vercel                 Render
            (Frontend)             (Backend)
                │                     │
                └──────────┬──────────┘
                           ▼
                     MongoDB Atlas
                       (Database)
                           │
                           ▼
                       Cloudinary
                     (Image Storage)
```

---

## 🔐 Security

- JWT authentication on every protected route
- Passwords hashed with bcrypt — never stored in plain text
- Role-based admin authorization for moderation
- User-scoped authorization (you can only edit/delete your own content, unless you're an admin)
- CORS locked to the deployed frontend's origin
- Secrets kept in environment variables, never committed

---

## 🎯 Project Highlights

What makes this more than a basic CRUD app:

- **Real-time social feed** — posts, likes, and comments sync live across every connected user via Socket.io
- **Cloud image storage** — uploads go straight to Cloudinary, so they survive redeploys (unlike local disk storage on ephemeral hosts)
- **Admin moderation** — a role-based system for removing inappropriate posts beyond just "your own content"
- **Full deployment pipeline** — live on Vercel + Render + Atlas + Cloudinary, not just running locally

---

## 📚 What I Learned

- Full-stack MERN application development end to end
- REST API design and JWT authentication
- Real-time communication with Socket.io
- MongoDB/Mongoose schema design, including relationships and role-based fields
- React component architecture, Context API (Auth + Socket), and React Router
- File/image upload handling and cloud storage integration
- CORS configuration across separate frontend/backend deployments
- Environment variable management across dev and production
- Debugging real production issues (DNS/Atlas connectivity, ephemeral filesystems)
- Git and GitHub workflow across a multi-stage project

---

## 🚧 Future Improvements

- 🗑️ Delete comments
- 🔔 Notification system
- 👤 User profile pages
- 👥 Follow / unfollow users
- 🔎 Search functionality
- 🌓 Dark / light theme toggle
- ✏️ Edit posts
- 🖼️ Multiple image uploads per post
- 📱 Improved mobile responsiveness
- 📩 Direct messaging

---

## ⭐ Support

If you find this project interesting, consider giving the repository a ⭐ on GitHub!

---

## 📌 Project Status

🟢 **Active — Deployed & Functional**