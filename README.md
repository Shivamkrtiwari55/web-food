# Vercel Deployment Guide

## Frontend (User App)
- Directory: `frontend`
- Framework: React + Vite
- Vercel will detect the `vercel.json` in `frontend/` and deploy as a static site.
- Build command: `vite build` (default)
- Output directory: `dist`

## Admin Panel
- Directory: `admin`
- Framework: React + Vite
- Vercel will detect the `vercel.json` in `admin/` and deploy as a static site.
- Build command: `vite build` (default)
- Output directory: `dist`

## Backend (API Server)
- Directory: `backend`
- Framework: Node.js (Express)
- **Vercel does NOT support custom Express servers directly.**
  - You can only deploy as [serverless functions](https://vercel.com/docs/functions/serverless-functions) (by moving each route to `/api/`), or deploy the backend separately (e.g., [Render](https://render.com/), [Railway](https://railway.app/), or a Vercel serverless API project).
  - The current `vercel.json` in `backend/` is for serverless functions, but your code uses a custom server (`server.js`).
  - For production, move backend to a separate deployment and update frontend/admin API URLs accordingly.

## Monorepo Tips
- You can import each directory as a separate project in Vercel (one for `frontend`, one for `admin`, one for `backend` if using serverless functions).
- Set the root directory for each project in Vercel dashboard.
- Make sure environment variables are set in Vercel dashboard for each project (e.g., API URLs, database credentials).

---

For more details, see [Vercel Monorepos Guide](https://vercel.com/docs/projects/monorepos). 