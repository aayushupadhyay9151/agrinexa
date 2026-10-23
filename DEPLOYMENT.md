# AgriNexa Deployment Guide (Render + Vercel)

This guide walks you through deploying AgriNexa with **Render** (Backend API) and **Vercel** (Frontend UI).

---

## Part 1: Deploy Backend on Render

1. Go to [render.com](https://render.com/) and log in.
2. Click **New +** -> **Web Service**.
3. Select **Build and deploy from a Git repository** and connect:
   `https://github.com/aayushupadhyay9151/agrinexa`
4. Configure the service settings:
   - **Name:** `agrinexa-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`
5. Under **Environment Variables**, add:
   - `NODE_VERSION` = `22.14.0` (Required for native `node:sqlite`)
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `(Click "Generate" or type a secret key)`
   - `PORT` = `5000` (Render will also provide PORT automatically)
   - `CORS_ORIGIN` = `*`
6. Click **Create Web Service**.
7. Once deployed, copy your Render backend URL (e.g., `https://agrinexa-backend.onrender.com`).
   - Test it: `https://agrinexa-backend.onrender.com/api/health` should return `{"status": "healthy", ...}`.

---

## Part 2: Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com/) and log in with GitHub.
2. Click **Add New...** -> **Project**.
3. Import the `agrinexa` repository.
4. Configure the project:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click "Edit" and choose `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Under **Environment Variables**, add:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://agrinexa-backend.onrender.com` (Your Render backend URL from Part 1)
6. Click **Deploy**.
7. In ~1 minute, your site will be live at `https://<your-project>.vercel.app`!

---

## 🔑 Demo Login in Production
Once deployed, users can sign in immediately:
- **Email:** `demo@agrinexa.com`
- **Password:** `demo12345`
- Or click the **"1-Click Demo"** button on the login screen.
