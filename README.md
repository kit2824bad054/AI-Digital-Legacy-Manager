# 🌌 AI Digital Legacy Manager

> A secure, full-stack platform where users can safely store their digital life — legal will, future scheduled letters, memory capsule, encrypted secrets, and an AI personality snapshot for their loved ones.

---

## 📖 What is it?

**AI Digital Legacy Manager** is a next-generation platform designed to preserve what matters most in the digital era. It bridges legal estate planning, sentimental memory keeping, confidential credentials, and generative artificial intelligence into a unified, encrypted vault.

Whether drafting your final digital testament, scheduling milestone letters for your children decades in the future, securing crypto keys and banking notes, or training an AI personality replica powered by Google Gemini, the platform guarantees that your wisdom, assets, and voice remain preserved and protected for eternity.

---

## ✨ Features

### 1. 🔐 Zero-Knowledge Authentication
- Full cryptographic sign-up and login with `bcryptjs` (salt rounds: 10).
- High-entropy JSON Web Tokens (JWT) with automatic local session persistence.
- Protected client-side routes with unauthorized access redirection.
- Dynamic session management with instant logout and token invalidation.

### 2. 📝 Digital Will & Asset Allocations
- Interactive Digital Will builder with legal testament drafting.
- Digital asset allocations (bank accounts, cryptocurrencies, hardware keys, cloud directives).
- Real-time word counter and last-saved timestamp tracker.
- Built-in standardized legal will templates.
- Full CRUD operations with MongoDB Atlas persistence.

### 3. 💌 Future Scheduled Letters
- Date-locked emotional and milestone letters to be opened on exact future dates.
- Assign designated recipient names and specific delivery calendar dates.
- Automatic chronological sorting by delivery date.
- Real-time editing, draft updates, and deletion with confirmation dialogs.

### 4. 🖼️ Precious Memory Capsule
- Secure multimedia photo archives with sentimental captions and dates.
- Handled with `multer` file validation (JPG, JPEG, PNG up to 5MB).
- Responsive gallery layout with hover-card zoom transitions.
- Interactive full-screen modal lightbox for deep viewing.
- Automatic server-side storage cleanup upon deletion.

### 5. 🔑 Confidential Secret Vault
- High-security storage for passwords, PIN codes, banking notes, crypto seed phrases, and confidential instructions.
- Masked by default (`••••••••••••`) to prevent shoulder surfing.
- Smooth CSS reveal animation with toggleable show/hide eye controls.
- One-click "Copy to Clipboard" with instant visual confirmation.

### 6. 🤖 AI Personality Snapshot (Google Gemini)
- 10 structured reflection questions exploring life lessons, values, humor, and dreams.
- Step-by-step wizard with animated percentage progress bar and word counter.
- **Backend-only integration** with Google Gemini API (`gemini-1.5-flash` / `gemini-2.0-flash`).
- Synthesizes a structured JSON portrait:
  - 2–3 paragraph inspiring legacy summary
  - 5 core character traits as glowing purple badges
  - 3 standout virtues and strengths with custom icons
  - Enduring legacy declaration in prominent typography
  - Meaningful philosophical quote in italics
- One-click regeneration and permanent MongoDB Atlas sync.

### 7. 🎨 Dark & Mysterious UI / UX Design
- Curated color scheme: `#0a0a0f` obsidian background, `#6b21a8` deep purple, and `#a855f7` amethyst glow.
- Glassmorphism surfaces (`rgba(19, 19, 31, 0.8)` with `backdrop-filter: blur(10px)`).
- Floating purple particle background on the landing page.
- Smooth CSS keyframe animations (Strictly **No Framer Motion** for zero bundle bloat).
- Fixed bottom-right toast feedback alerts (3-second auto-dismiss).
- Fully responsive across desktop, tablet, and mobile with off-canvas hamburger navigation.

---

## 🛠️ Tech Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | Ultra-fast SPA build tooling and client-side rendering |
| **Styling** | Tailwind CSS + Vanilla CSS | Custom glassmorphism, glow box-shadows, pure CSS keyframes |
| **Icons** | Lucide React | High-performance, accessible SVG icon library |
| **Routing** | React Router v6 | Client-side routing with guarded layout wrappers |
| **Backend** | Node.js, Express.js | RESTful JSON API server with security middleware |
| **Database** | MongoDB Atlas, Mongoose | Cloud-native NoSQL document database |
| **Security & Auth** | bcryptjs, jsonwebtoken | Salted password hashing & JWT bearer token auth |
| **File Handling** | Multer | Multipart form-data processing with size & MIME filtering |
| **Generative AI** | Google Gemini API | `@google/generative-ai` with structured JSON synthesis |
| **Deployment** | Vercel (Frontend), Render (Backend) | Production continuous deployment pipeline |

---

## 💻 How to Run Locally

### 1. Prerequisites
- **Node.js**: v18.x or later installed (`node -v`)
- **npm**: v9.x or later installed (`npm -v`)
- **Git**: installed (`git --version`)
- A free **MongoDB Atlas** database cluster
- A free **Google AI Studio** Gemini API key

---

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/AI-Digital-Legacy-Manager.git
cd AI-Digital-Legacy-Manager
```

---

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create your .env file
cp .env.example .env
```

Open `backend/.env` and supply your actual credentials:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/digital_legacy_db?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_2026_xyz
GEMINI_API_KEY=your_google_ai_studio_api_key
```

**Start Backend in Development Mode:**
```bash
npm run dev
```
Server runs on: `http://localhost:5000`  
Health check endpoint: `http://localhost:5000/api/test/health`

---

### 4. Frontend Setup

Open a new terminal window:
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create your .env file
cp .env.example .env
```

Open `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_TITLE=AI Digital Legacy Manager
```

**Start Frontend Development Server:**
```bash
npm run dev
```
Frontend runs on: `http://localhost:5173`

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Local Express server port | `5000` |
| `NODE_ENV` | Runtime mode | `development` or `production` |
| `CLIENT_URL` | Allowed frontend origin for CORS | `http://localhost:5173` or `https://your-app.vercel.app` |
| `MONGODB_URI` | MongoDB Atlas cluster connection string | `mongodb+srv://user:pass@cluster0.mongodb.net/legacy_db` |
| `JWT_SECRET` | Secret key for signing auth tokens | `super_secure_random_string_32_chars` |
| `JWT_EXPIRES_IN` | Duration of authentication session | `7d` |
| `GEMINI_API_KEY` | Google AI Studio API Key (**backend only**) | `AIzaSy...` |

### Frontend (`frontend/.env`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | Target backend URL | `http://localhost:5000` or `https://your-backend.onrender.com` |
| `VITE_API_BASE_URL` | Fallback API base URL | `http://localhost:5000` |
| `VITE_APP_TITLE` | Browser tab title | `AI Digital Legacy Manager` |

---

## 🚀 Production Deployment Guide

### 1. MongoDB Atlas Setup
1. Log in to [MongoDB Atlas](https://cloud.mongodb.com).
2. Go to **Network Access** → Click **Add IP Address**.
3. Choose **Allow Access from Anywhere** (`0.0.0.0/0`) → Confirm.
4. Go to **Database** → Click **Connect** → Choose **Drivers (Node.js)**.
5. Copy the connection string (e.g. `mongodb+srv://<username>:<password>@cluster0.mongodb.net/digital_legacy_db?retryWrites=true&w=majority`).

---

### 2. Backend Deployment on Render
1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete Phase 5 and production deployment configuration"
   git push origin main
   ```
2. Log in to [Render](https://render.com) and click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Configure the Web Service:
   - **Name**: `ai-digital-legacy-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URI`: `<your_mongodb_atlas_connection_string>`
   - `JWT_SECRET`: `<your_secure_jwt_secret>`
   - `GEMINI_API_KEY`: `<your_google_gemini_api_key>`
   - `CLIENT_URL`: `https://your-frontend.vercel.app`
6. Click **Deploy Web Service** and copy your live backend URL (e.g. `https://ai-digital-legacy-backend.onrender.com`).

---

### 3. Frontend Deployment on Vercel
1. Log in to [Vercel](https://vercel.com) and click **Add New...** → **Project**.
2. Select your GitHub repository.
3. Configure the Project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Under **Environment Variables**, add:
   - `VITE_API_URL`: `https://ai-digital-legacy-backend.onrender.com` (your Render backend URL)
   - `VITE_API_BASE_URL`: `https://ai-digital-legacy-backend.onrender.com`
5. Click **Deploy**.
6. When deployment finishes, copy your live Vercel domain (e.g. `https://ai-digital-legacy-manager.vercel.app`).
7. *(Optional)* Return to Render, update `CLIENT_URL` with your exact Vercel domain, and re-trigger deployment.

---

## 🌐 Live Demo Link

- **Frontend (Vercel)**: `https://ai-digital-legacy-manager.vercel.app` *(Replace with your live URL)*
- **Backend API (Render)**: `https://ai-digital-legacy-backend.onrender.com` *(Replace with your live URL)*
- **API Health Check**: `https://ai-digital-legacy-backend.onrender.com/api/test/health`

---

## 📸 Screenshots & Architecture

### 1. Landing Page & Live Connectivity Diagnostics
The landing hero features floating purple particle dots, real-time backend connection status, round-trip latency benchmarks, and overview of the 4 legacy pillars.

### 2. Digital Will Builder
Comprehensive estate planning document editor with asset allocation guidelines, character counters, and permanent MongoDB syncing.

### 3. Future Scheduled Letters
Calendar date-locked letters with designated recipients and emotional notes, automatically sorted by delivery date.

### 4. Memory Capsule & Lightbox
Multimedia photo archive with file validation, timestamp badges, responsive grid layout, and full-screen image modal.

### 5. Secret Vault
AES-256 encrypted credential cards with masked content (`••••••••`), toggleable show/hide eye buttons, and one-click clipboard copying.

### 6. AI Personality Snapshot
10-question reflective legacy questionnaire with dynamic progress bar, cosmic loader, 5 purple trait badges, 3 strength icons, and AI synthesized legacy statement.

---

## 🛡️ Security & Privacy Architecture

- **Zero Plain-Text Secrets**: Passwords are encrypted using salted `bcryptjs` hashing before touching MongoDB Atlas.
- **Backend-Only AI Operations**: Google Gemini API keys are never exposed in frontend bundles or network tabs.
- **Client Route Protection**: Unauthenticated traffic is blocked at the React Router layer and forwarded to `/login`.
- **Stateless Authentication**: Sessions are authenticated using cryptographic HMAC-SHA256 JWT signatures.
- **Zero Framer Motion**: All transitions are executed using pure CSS keyframes for maximum performance, minimal bundle weight, and rapid rendering.

---

## 📄 License
This project is licensed under the ISC License.
