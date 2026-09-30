# 🌌 AI Digital Legacy Manager

> A secure, full-stack platform where users can safely store their digital life — legal will, future scheduled letters, memory capsule, encrypted secrets, and an AI personality snapshot for their loved ones.

---

## 🎨 Theme & Visual Identity

- **Theme**: Dark & Mysterious
- **Background**: `#0a0a0f`
- **Primary**: `#6b21a8` (Deep Royal Purple)
- **Accent**: `#a855f7` (Vibrant Amethyst)
- **Glow**: `#7c3aed` (Neon Violet Glow)
- **Text**: `#e2e8f0` (Light Slate)
- **Cards**: `#13131f` (Glassmorphism Frosted Dark Surface)
- **Animations**: Pure CSS keyframe animations (Strictly **No Framer Motion**)

---

## 🛠️ Complete Tech Stack

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React v18, Vite, Tailwind CSS, Lucide React, React Router v6 | High-performance SPA with custom glassmorphism design system |
| **Backend** | Node.js, Express, CORS, dotenv | RESTful API server with security middleware |
| **Database & Auth** | MongoDB Atlas, Mongoose, bcryptjs, jsonwebtoken | Cloud database & zero-knowledge authentication |
| **File Processing** | Multer, PDF-parse, Mammoth | Legal will document (.pdf, .docx) ingestion & text extraction |
| **AI Synthesis** | Google Gemini API (`gemini-2.5-flash`) | Structured JSON extraction of wills & personality snapshots (**Backend Only**) |
| **Hosting** | Vercel (Frontend), Render (Backend), MongoDB Atlas (Database) | Cloud production architecture |

---

## 📁 Complete Folder Structure

```text
AI-Digital-Legacy-Manager/
├── .gitignore                     # Root Git ignore (protects .env and node_modules)
├── README.md                      # Comprehensive project documentation
│
├── backend/                       # Node.js & Express API Server
│   ├── .env                       # Backend secrets (MongoDB URI, JWT Secret, Gemini API Key)
│   ├── .env.example               # Template environment configuration
│   ├── .gitignore                 # Backend-specific ignore
│   ├── package.json               # Backend dependencies & scripts
│   ├── server.js                  # Express entry point, CORS, routes & error handling
│   ├── config/
│   │   └── db.js                  # MongoDB Atlas Mongoose connection logic
│   ├── controllers/               # Business logic controllers (Auth, Will, Vault, AI)
│   │   └── README.md
│   ├── middleware/                # Custom middleware (JWT auth, Multer upload)
│   │   └── README.md
│   ├── models/                    # Mongoose schemas (User, Will, Letter, Vault, Snapshot)
│   │   └── README.md
│   └── routes/                    # API endpoints
│       └── testRoutes.js          # /api/test/health & /api/test/echo diagnostics
│
└── frontend/                      # React 18 + Vite + Tailwind CSS SPA
    ├── .env                       # Frontend public variables (VITE_API_BASE_URL)
    ├── .env.example               # Template for frontend environment
    ├── .gitignore                 # Frontend-specific ignore
    ├── index.html                 # Single page HTML with Google Fonts & dark metadata
    ├── package.json               # Frontend dependencies & scripts
    ├── postcss.config.js          # PostCSS configuration for Tailwind
    ├── tailwind.config.js         # Custom dark theme colors, glow box-shadows, animations
    ├── vite.config.js             # Vite configuration with React & /api proxy to port 5000
    └── src/
        ├── App.jsx                # React Router setup for all 6 pages + global layout
        ├── index.css              # Tailwind directives + glassmorphism & glow classes
        ├── main.jsx               # React 18 DOM mount entry point
        ├── components/
        │   ├── Navbar.jsx         # Sticky glassmorphic navbar with active routes & mobile menu
        │   └── Footer.jsx         # Dark footer with module links & security badges
        └── pages/
            ├── HomePage.jsx       # Hero, live backend connection tester & 4 legacy pillars
            ├── AuthPage.jsx       # Login & Signup tabbed glassmorphic card
            ├── DashboardPage.jsx  # Digital Will builder & Future Letters scheduler
            ├── MemoryVaultPage.jsx# Encrypted credentials & multimedia memory capsules
            ├── PersonalitySnapshotPage.jsx # Gemini 2.5 Flash avatar & personality blueprint
            └── DeploymentPage.jsx # Vercel, Render & MongoDB Atlas production guide
```

---

## ⚡ Installation & Setup Instructions

### 1. Prerequisites
- **Node.js**: v18.x or later installed (`node -v`)
- **npm**: v9.x or later installed (`npm -v`)
- **Git**: installed (`git --version`)

---

### 2. Backend Setup

Open a terminal in the project root:

```bash
# Navigate to the backend directory
cd backend

# Install all backend dependencies
npm install

# Verify your .env file
# (backend/.env has been created with template values. Update MONGODB_URI and GEMINI_API_KEY)
```

**To start the backend in development mode (auto-reload via nodemon):**
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`.  
Test health check URL: `http://localhost:5000/api/test/health`

---

### 3. Frontend Setup

Open a separate terminal in the project root:

```bash
# Navigate to the frontend directory
cd frontend

# Install all frontend dependencies
npm install

# Start Vite development server
npm run dev
```

The frontend will start on `http://localhost:5173`.

---

## 🔌 Frontend & Backend Connectivity

1. Launch both servers:
   - Backend on `http://localhost:5000`
   - Frontend on `http://localhost:5173`
2. Open `http://localhost:5173` in your browser.
3. The **Live Backend Diagnostic Card** on the Home Page will automatically test the connection to `http://localhost:5000/api/test/health` and display latency, MongoDB Atlas status, and service health!
4. Click **"Send Bidirectional Echo Test"** to test a live POST request payload between React and Express.

---

## 🔐 Environment Variables Guide

### Backend (`backend/.env`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Local server port | `5000` |
| `NODE_ENV` | Runtime environment | `development` or `production` |
| `CLIENT_URL` | Allowed frontend origin for CORS | `http://localhost:5173` |
| `MONGODB_URI` | MongoDB Atlas cloud connection URI | `mongodb+srv://<user>:<pwd>@cluster0.mongodb.net/digital_legacy_db` |
| `JWT_SECRET` | Secret key for JWT auth signing | `legacy_guardian_ultra_secure_jwt_secret_key_2026_xyz987` |
| `JWT_EXPIRES_IN`| Token lifespan | `7d` |
| `GEMINI_API_KEY`| Google Gemini API key (**backend only**) | `AIzaSy...` |

### Frontend (`frontend/.env`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Target API URL | `http://localhost:5000` |
| `VITE_APP_TITLE` | Application Title | `AI Digital Legacy Manager` |

---

## 🚀 The 6 Built Pages

1. **Home Page (`/`)**: Hero section, live full-stack connectivity test, feature pillars, security badge.
2. **Login & Signup (`/auth`)**: Tabbed glassmorphic authentication card with clean validation styling.
3. **Dashboard & Will (`/dashboard`)**: Digital Will builder, asset allocations, future letters scheduler, document upload pipeline.
4. **Memory Capsule & Vault (`/vault`)**: AES-256 encrypted credential viewer, toggleable secrets, and photo/voice archive cards.
5. **AI Personality Snapshot (`/ai-snapshot`)**: Google Gemini 2.5 Flash personality matrix, cognitive traits, and simulated avatar chat.
6. **Deployment Guide (`/deployment`)**: Architecture checklist for Vercel, Render, and MongoDB Atlas.

---

## 🔒 Security Best Practices
- **Never expose API keys**: Google Gemini API key and MongoDB credentials are exclusively loaded in `backend/.env`.
- **Zero-knowledge architecture**: Passwords and secrets are never logged or stored in plain text.
- **Pure CSS**: Zero Framer Motion bundle overhead for maximum speed and security.
