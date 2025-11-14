# MERN Blog — Full-Stack MERN Application

![Blog App](./blog.png)

This repository contains a full-stack MERN (MongoDB, Express, React, Node) blog application built for the Week 4 GitHub Classroom assignment. It demonstrates complete integration between a React front-end and an Express/MongoDB back-end, with user authentication, CRUD functionality for posts, image uploads, and category management.

---

## Table of Contents

- [Assignment Overview](#assignment-overview)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Requirements](#requirements)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [API Overview](#api-overview)
- [Authentication & File Uploads](#authentication--file-uploads)
- [Submission](#submission)
- [Resources](#resources)
- [License](#license)

---

## Assignment Overview

This project is a blog application with the following features:

1. RESTful API using Express.js and MongoDB
2. React front-end with reusable components and page architecture
3. Full CRUD functionality for blog posts
4. User authentication and authorization (JWT-based)
5. Image upload support and placeholder for comments

---

## Project Structure

mern-blog/
├── client/ # React front-end
│ ├── public/ # Static files
│ ├── src/ # React source code
│ │ ├── components/ # Reusable components
│ │ ├── pages/ # Page components (Home, Login, Register, etc.)
│ │ ├── hooks/ # Custom React hooks (useApi)
│ │ ├── services/ # API services (postService, authService, etc.)
│ │ ├── context/ # React context providers (AuthProvider)
│ │ └── App.jsx # Main application component
│ └── package.json # Client dependencies
├── server/ # Express.js back-end
│ ├── config/ # Configuration files (db.js)
│ ├── controllers/ # Route controllers (postController, authController)
│ ├── models/ # Mongoose models (User, Post, Category)
│ ├── routes/ # API routes
│ ├── middleware/ # Custom middleware (auth, upload)
│ ├── utils/ # Utility functions
│ ├── server.js # Main server file
│ └── package.json # Server dependencies
└── README.md # Project documentation
└── blog.png # Project homepage screenshot

Navigate to the server and client folders to install dependencies:

# Server
cd server
npm install

# Client
cd ../client
npm install


Set up environment variables (see next section).

Start MongoDB (locally or via Atlas).

Requirements

Node.js v18 or higher

MongoDB (local or Atlas)

npm or yarn

Git

Environment Variables

Create a .env file in the server/ directory:

PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<a-strong-jwt-secret>
CLIENT_URL=http://localhost:5173

Running the App

Development Mode (client & server separately)

Server

cd server
npm run dev


Client

cd client
npm run dev


API Overview

Base URL: http://localhost:5000/api

Auth

POST /api/auth/register — Register a new user
Body: { username, email, password }

POST /api/auth/login — Login and get a JWT
Body: { email, password }

Posts

GET /api/posts — List posts (supports query params like ?category=tech)

GET /api/posts/:id — Get single post by ID

POST /api/posts — Create a post (protected)
Body: { title, content, category, image } (image via multipart/form-data)

PUT /api/posts/:id — Update a post (protected, owner-only)

DELETE /api/posts/:id — Delete a post (protected, owner-only)

Categories

GET /api/categories — List categories

POST /api/categories — Create category (protected)

File Uploads

POST /api/upload — Upload images (multipart/form-data)
Returns URL or path to uploaded file

Note: Protected routes require an Authorization header: Authorization: Bearer <token>.

Authentication & File Uploads

JWT-based authentication

Passwords hashed via bcrypt

Protected routes using middleware

File uploads handled via multer, stored in server/uploads/

Submission

Push all your changes to your GitHub Classroom repository. Ensure:

Full client and server implementations

All API endpoints functional

Necessary React components and hooks created

README.md documents setup, API, and usage

Screenshots (like blog.png) included in the root

---

## Deployment

This project is deployed to **Render** and **Netlify**:

- **Backend (API)**: Express server deployed as a Render Web Service
- **Frontend (Client)**: Vite React app deployed as a Netlify site

### Local Development

1. Start MongoDB (local or Atlas).
2. Configure environment variables:
   - `server/.env` (based on `server/.env.example`)
   - `client/.env` (e.g. `VITE_API_URL=http://localhost:5000`)
3. Run backend:

   ```bash
   cd server
   npm run dev
   ```

4. Run frontend:

   ```bash
   cd client
   npm run dev
   ```

### Production (Render)

**Backend Web Service**

- Root directory: `server/`
- Build command: `npm ci`
- Start command: `node server.js` (or `npm start`)
- Environment variables (Render → Settings → Environment):
  - `NODE_ENV=production`
  - `PORT=5000`
  - `MONGODB_URI` or `MONGO_URI` (Atlas connection string)
  - `JWT_SECRET` (strong secret)
  - `CLIENT_URL` (frontend URL)
  - `LOG_LEVEL=info` (optional)
  - `SENTRY_DSN` (optional, for backend error tracking)

**Frontend (Netlify)**

- Build command: `npm run build`
- Publish directory: `dist`
- Environment variables (Netlify → Site configuration → Environment variables):
  - `VITE_API_URL` (backend root URL, e.g. `https://mern-stack-integration-imrannnnn.onrender.com`)
  - `VITE_SENTRY_DSN` (optional, for frontend error tracking)

---

## Deployed URLs

Deployed URLs:

- **Frontend (React app)**: https://mernimran.netlify.app/
- **Backend (API base)**: https://mern-stack-integration-imrannnnn.onrender.com/api

---

## CI/CD Pipeline

Continuous Integration and Deployment are configured with **GitHub Actions** and **Render Deploy Hooks**.

- **GitHub Actions workflows** (in `.github/workflows/`):
  - `server-ci.yml`
    - Runs on pushes/PRs to `main` affecting `server/`
    - Steps: install dependencies, lint (if present), test (if present), build (if present)
    - On successful CI for `main`, triggers the Render backend deploy hook
  - `client-ci.yml`
    - Runs on pushes/PRs to `main` affecting `client/`
    - Steps: install dependencies, lint, test (if present), build
    - On successful CI for `main`, triggers the Render frontend deploy hook

- **Render Deploy Hooks**
  - Backend: `RENDER_HOOK_API_PROD` (stored as a GitHub secret)
  - Frontend: `RENDER_HOOK_FE_PROD` (stored as a GitHub secret)
  - Auto-Deploy is turned **off** in Render so deployments only run when CI passes.

Include CI/CD screenshots in the repo, for example:

- `.github/screenshots/ci-server.png`
- `.github/screenshots/ci-client.png`

and reference them here if required by the assignment.

---

## Monitoring & Maintenance

### Health Checks

- **Liveness**: `GET /healthz` → returns `200 ok`
- **Readiness**: `GET /readyz` → returns `200 ready` when MongoDB is connected, otherwise `503 not-ready`
- Render Health Check can be configured to use `/healthz`.

### Logging & Error Tracking

- **Server logging**:
  - `morgan` for HTTP access logs
  - `winston` for structured JSON application logs
- **Error tracking (optional)**:
  - Backend: Sentry via `@sentry/node` (uses `SENTRY_DSN`)
  - Frontend: Sentry via `@sentry/react` (uses `VITE_SENTRY_DSN`)

### Uptime & Performance

- Uptime monitoring (e.g. UptimeRobot):
  - Monitor backend: `GET https://mern-stack-integration-imrannnnn.onrender.com/healthz`
  - Monitor frontend: `GET https://mernimran.netlify.app/`
- Render metrics: built-in CPU/memory/latency graphs for the backend service.

### Maintenance Plan

- Dependencies
  - Keep Node, NPM, and package dependencies up to date.
  - Use automated tools (e.g. Dependabot) to track updates.
- Database
  - Enable and monitor MongoDB Atlas backups.
  - Periodically test restores to a staging environment.
- Operations
  - See `docs/operations.md` for detailed deployment, rollback, and troubleshooting steps.

Resources

MongoDB Docs

Express Docs

React Docs

Node.js Docs

Mongoose Docs