# Social Media Feed Application

**Mani Bhushan** | B.Tech CSE, ITER, Siksha 'O' Anusandhan University (2024–2028)

Week 4 capstone project (MERN Internship): a full-stack social feed
with user auth, posts (text + optional image), likes, comments, and
**live real-time updates via Socket.io** — no page refresh needed to
see new posts, likes, or comments from other users.

## Structure

```
social-media-feed-app/
├── backend/     Express + MongoDB + JWT auth + Multer + Socket.io
├── frontend/    React + Vite + React Router + Socket.io client
└── docs/screenshots/
```

## Features

- User registration & login (JWT, bcrypt-hashed passwords)
- Create posts with optional image upload (Multer)
- Like / unlike posts
- Comment on posts
- **Real-time feed**: new posts, likes, and comments appear instantly
  in every open browser tab — no polling, no refresh

## How the real-time layer works

Two channels run side by side on the same backend server:

1. **REST API** — normal request/response: login, create a post, like a post, etc.
2. **Socket.io** — a persistent connection used only to *broadcast* that
   something changed. When a post is created via the REST endpoint, the
   server also emits a `newPost` event; every connected browser tab is
   listening for that event and updates its feed immediately.

The initial feed always loads via a REST `GET /api/posts` request
(sockets have no history — they only deliver events that happen while
connected). From that point forward, socket events keep everyone's
view in sync.

**Events used:** `newPost`, `postDeleted`, `postLiked`, `newComment`, `commentDeleted`

## Backend

### Endpoints
| Method | Route                          | Auth | Description                     |
|--------|--------------------------------|------|-----------------------------------|
| POST   | `/api/auth/register`           | No   | Create account                    |
| POST   | `/api/auth/login`              | No   | Log in, get a JWT                 |
| GET    | `/api/posts`                   | No   | Get the full feed                 |
| POST   | `/api/posts`                   | Yes  | Create a post (text + optional image) |
| DELETE | `/api/posts/:id`               | Yes  | Delete your own post              |
| POST   | `/api/posts/:id/like`          | Yes  | Toggle like on a post             |
| GET    | `/api/posts/:postId/comments`  | No   | Get a post's comments             |
| POST   | `/api/posts/:postId/comments`  | Yes  | Add a comment                     |
| DELETE | `/api/comments/:id`            | Yes  | Delete your own comment           |

### Run it
```bash
cd backend
npm install
cp .env.example .env    # set MONGO_URI and JWT_SECRET
npm run dev
```
Runs on `http://localhost:5040`. Test the REST endpoints with
`backend/postman_collection.json` (real-time events aren't visible in
Postman — see "Testing the real-time layer" below).

## Frontend

### Run it
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Runs on `http://localhost:5176`.

## Testing the real-time layer

Postman can't show you a broadcast — you need two browser tabs:

1. Open the app in two separate tabs (or one normal + one incognito),
   log in as two different users (register a second test account)
2. Post something from Tab A → it should appear instantly in Tab B,
   no refresh
3. Like a post from Tab B → the like count updates instantly in Tab A
4. Comment from either tab → appears live in both

## Deployment

- **Database:** MongoDB Atlas (reuse the free cluster from Weeks 2–3; just add a new database, e.g. `social-media-feed-app`)
- **Backend:** [Render](https://render.com) — connect the GitHub repo, set the root directory to `backend`, add the same env vars from `.env.example` in Render's dashboard, set `CLIENT_URL` to your deployed frontend's URL
- **Frontend:** [Vercel](https://vercel.com) — connect the GitHub repo, set the root directory to `frontend`, set `VITE_API_URL` and `VITE_SOCKET_URL` to your deployed Render backend URL (not localhost)
- **CORS:** the backend's `CLIENT_URL` env var must exactly match your deployed frontend's URL, or the browser will block requests

## Built with

Node.js · Express · MongoDB · Mongoose · bcryptjs · jsonwebtoken · Multer · Socket.io · React 18 · Vite · React Router · Axios · Socket.io Client
