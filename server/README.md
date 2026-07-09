# CivicConnect — MongoDB Atlas API

A standalone **Node.js + Express + Mongoose** backend for the CivicConnect app,
using **MongoDB Atlas** for storage and **JWT** for authentication.

This is a separate service from the Lovable frontend. It runs on a normal
Node.js host (your laptop, Render, Railway, etc.) — MongoDB and the AWS SDK
cannot run on the frontend's edge runtime, so the data layer lives here.

## 1. Install

```bash
cd server
npm install
```

## 2. Configure

```bash
cp .env.example .env
```

Then edit `.env` and set your `MONGODB_URI`, a long random `JWT_SECRET`, and
your allowed `CORS_ORIGIN`(s). (A working `.env` is already included for local
development.)

## 3. Seed a default admin (optional)

```bash
npm run seed
```

Creates `admin@civicconnect.local` / `Admin@1234` and a couple of sample staff.

## 4. Run

```bash
npm run dev     # auto-restart on changes
# or
npm start
```

The API listens on `http://localhost:4000`.

## Endpoints

| Method | Path                          | Auth        | Description                    |
| ------ | ----------------------------- | ----------- | ------------------------------ |
| GET    | `/health`                     | —           | Health check                   |
| POST   | `/api/auth/register`          | —           | Create a user account          |
| POST   | `/api/auth/login`             | —           | Email + password login         |
| POST   | `/api/auth/admin-login`       | —           | Admin code + password login    |
| GET    | `/api/auth/me`                | Bearer      | Current user                   |
| POST   | `/api/issues`                 | Bearer      | Create a report                |
| GET    | `/api/issues`                 | Bearer      | List reports (own / all)       |
| GET    | `/api/issues/track/:ticketId` | —           | Public ticket lookup           |
| PATCH  | `/api/issues/:id/status`      | Admin       | Update status                  |
| DELETE | `/api/issues/:id`             | Admin       | Delete a report                |
| GET    | `/api/staff`                  | Admin       | List staff                     |
| POST   | `/api/staff`                  | Admin       | Add staff                      |
| PATCH  | `/api/staff/:id`              | Admin       | Update staff                   |
| DELETE | `/api/staff/:id`              | Admin       | Remove staff                   |
| POST   | `/api/contact`                | —           | Send a contact message         |
| GET    | `/api/contact`                | Admin       | List contact messages          |
| GET    | `/api/stats`                  | Admin       | Dashboard summary              |
| GET    | `/api/stats/categories`       | Admin       | Counts by category             |

Send the token as `Authorization: Bearer <token>` on protected routes.

## Deploying (for your viva/demo)

1. Push this `server/` folder to a Git repo.
2. Create a free **Render** or **Railway** web service pointing at it.
3. Set the same environment variables from `.env` in the host's dashboard.
4. Whitelist the host's IP (or `0.0.0.0/0` for a demo) in MongoDB Atlas →
   Network Access.

## Migrating the frontend later

Point the React app at this API by adding `VITE_API_BASE_URL` and replacing the
current auth/data calls with `fetch` calls to these endpoints. Because auth is
plain JWT here, the same pattern will carry over to AWS DynamoDB (also an
AWS SDK + Node server, same constraint as MongoDB).
