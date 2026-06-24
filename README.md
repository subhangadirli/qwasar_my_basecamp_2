# MyBasecamp2 - Backend + Frontend

## Live Demo

🔗 **Hosted app:** https://my-basecamp-2.onrender.com _(replace with your deployed URL after the first deploy — see [Deployment](#deployment))_

## Task

The goal of this project is to deliver a working Basecamp-like application where authenticated users can manage projects through a complete backend API and a connected frontend interface. Required capabilities include registration, sign in, sign out, role-aware authorization, and project CRUD operations.

**MyBasecamp2** extends MyBasecamp1 with collaboration features inside a project:

- **Members** — projects now have associated members. The owner is the project admin; admins can add/remove members.
- **Attachments** — any associated user can upload (png/jpg/pdf/txt) and delete attachments on a project. The file format is stored and shown on the project page. Multiple attachments per project are supported.
- **Threads** ("let's discuss!") — only a project admin can create, edit, and delete discussion threads.
- **Messages** — any associated user can post messages into a thread; a message can be edited/deleted by its author or a project admin.

## Description

This repository contains a full-stack application with an Express backend, SQLite persistence, and a React + Vite frontend. The backend uses an MVC-style folder organization: `models` for data access, `controllers` for business logic, `routes` for endpoint mapping, and `middleware` for authentication and role checks. Authentication is session-cookie based, and protected endpoints validate user identity and permissions before data-changing actions.

## Installation

Use Node.js and npm, then run installation from the repository root. Root installation also installs frontend dependencies through `postinstall`, so both layers are prepared in one step. After dependency installation, seed the default admin account for quick validation. If your environment reports native sqlite binding issues, reinstall dependencies and rebuild sqlite before launching the server.

```bash
npm install
npm run seed
```

Default admin credentials:
- Email: `admin@basecamp.com`
- Password: `admin123`

If sqlite native binding/GLIBC issues appear:

```bash
rm -rf node_modules package-lock.json
npm install
npm rebuild sqlite3
```

## Usage

Run backend and frontend independently during development, or use the combined script to start both together. Backend serves API routes on port `8080`, while frontend runs on port `5173` and sends credentialed requests to the backend. For production-style frontend validation, build the frontend bundle. The following commands cover normal development and verification usage.

```bash
npm start                 # backend only (http://localhost:8080)
npm run dev               # frontend only (http://localhost:5173)
npm run dev:all           # backend + frontend together
npm run frontend:build    # production frontend build
```

## API Endpoints

Base URL: `http://localhost:8080/api`

### Auth
| Method | URL | Description | Auth |
|--------|-----|-------------|------|
| POST | /api/sessions/signin | Sign in | - |
| DELETE | /api/sessions/signout | Sign out | ✓ |

### Users
| Method | URL | Description | Auth |
|--------|-----|-------------|------|
| POST | /api/users | Register | - |
| GET | /api/users | Get all users | Admin |
| GET | /api/users/:id | Get user | ✓ |
| DELETE | /api/users/:id | Delete user | Self/Admin |
| POST | /api/users/:id/admin | Grant admin | Admin |
| DELETE | /api/users/:id/admin | Revoke admin | Admin |

### Projects
| Method | URL | Description | Auth |
|--------|-----|-------------|------|
| GET | /api/projects | Get all projects | ✓ |
| GET | /api/projects/:id | Get project | ✓ |
| POST | /api/projects | Create project | ✓ |
| PUT | /api/projects/:id | Update project | Owner/Admin |
| DELETE | /api/projects/:id | Delete project | Owner/Admin |

### Members
| Method | URL | Description | Auth |
|--------|-----|-------------|------|
| GET | /api/projects/:id/members | List members | Member |
| POST | /api/projects/:id/members | Add member (by `username` or `email`) | Project admin |
| DELETE | /api/projects/:id/members/:userId | Remove member | Project admin |

### Attachments
| Method | URL | Description | Auth |
|--------|-----|-------------|------|
| GET | /api/projects/:id/attachments | List attachments | Member |
| POST | /api/projects/:id/attachments | Upload a file (multipart field `file`) | Member |
| GET | /api/projects/:id/attachments/:attachmentId/download | Download a file | Member |
| DELETE | /api/projects/:id/attachments/:attachmentId | Delete an attachment | Member |

### Threads
| Method | URL | Description | Auth |
|--------|-----|-------------|------|
| GET | /api/projects/:id/threads | List threads | Member |
| GET | /api/projects/:id/threads/:threadId | Get thread + messages | Member |
| POST | /api/projects/:id/threads | Create thread | Project admin |
| PUT | /api/projects/:id/threads/:threadId | Update thread | Project admin |
| DELETE | /api/projects/:id/threads/:threadId | Delete thread | Project admin |

### Messages
| Method | URL | Description | Auth |
|--------|-----|-------------|------|
| POST | /api/projects/:id/threads/:threadId/messages | Post a message | Member |
| PUT | /api/projects/:id/threads/:threadId/messages/:messageId | Edit a message | Author/Admin |
| DELETE | /api/projects/:id/threads/:threadId/messages/:messageId | Delete a message | Author/Admin |

---

## Request Examples

### Register
```json
POST /api/users
{
  "username": "john",
  "email": "john@test.com",
  "password": "123456"
}
```

### Sign In
```json
POST /api/sessions/signin
{
  "email": "john@test.com",
  "password": "123456"
}
```

### Create Project
```json
POST /api/projects
{
  "name": "Project Name",
  "description": "Project description"
}
```

### Update Project
```json
PUT /api/projects/:id
{
  "name": "New Name",
  "description": "New description"
}
```

---

## Deployment

The app is built as a **single deploy**: in production the Express server serves the built React SPA from `frontend/dist`, so the API and UI share one origin/URL.

### Deploy to Render (using `render.yaml`)

1. Push this repository to GitHub/Gitea.
2. In [Render](https://render.com), create a new **Blueprint** from the repo — `render.yaml` provisions a Node web service with:
   - `buildCommand`: `npm install && npm run frontend:build`
   - `startCommand`: `npm start`
   - a **persistent disk** mounted at `data/` so the SQLite DB (`data/basecamp.db`) and uploaded files (`data/uploads/`) survive restarts.
   - `NODE_ENV=production` and an auto-generated `SESSION_SECRET`.
3. After the first deploy, open a shell on the service and run `npm run seed` once to create the default admin (or register a user via the UI).
4. Copy the live URL Render gives you into the **Live Demo** link at the top of this README.

### Environment variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `PORT` | Server port | `8080` |
| `NODE_ENV` | `production` enables static SPA serving + secure cookies | unset (dev) |
| `SESSION_SECRET` | Session signing secret | dev fallback |
| `CLIENT_ORIGIN` | Allowed CORS origin (dev only; same-origin in prod) | `http://localhost:5173` |

Any host with a persistent volume (Railway, Fly.io, a VPS) works the same way — point the volume at `data/`.

## Notes

- Architecture follows MVC-style folders: `models`, `controllers`, `routes`, `middleware`
- Database layer uses `sqlite3` with SQL queries (no ORM)
- All responses are JSON
- Authentication is session cookie based
- Frontend is configured for `http://localhost:5173`
- Backend is configured for `http://localhost:8080`
- CORS is enabled with credentials support
- If `vite` is missing, run `npm install` in root
- License: `AGPL-3.0-only` (`LICENSE` file)

## The Core Team
salmanli_n
gadirli_s

<span><i>Made at <a href='https://qwasar.io'>Qwasar SV -- Software Engineering School</a></i></span>
<span><img alt='Qwasar SV -- Software Engineering School's Logo' src='https://storage.googleapis.com/qwasar-public/qwasar-logo_50x50.png' width='20px' /></span>
