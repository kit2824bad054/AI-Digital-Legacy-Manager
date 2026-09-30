/**
 * ============================================================
 * AI DIGITAL LEGACY MANAGER - BACKEND SERVER (server.js)
 * ============================================================
 * Tech Stack:
 * - Runtime: Node.js
 * - Web Framework: Express.js
 * - Database ODM: Mongoose (connecting to MongoDB Atlas)
 * - Middleware: CORS, express.json(), express.urlencoded()
 * - Environment Management: dotenv
 *
 * Rules Adhered To:
 * 1. Gemini API is accessed ONLY via backend endpoints (never exposed to client).
 * 2. All secret keys are read strictly from .env.
 * 3. MongoDB Atlas connection only (with friendly warnings).
 * 4. Structured for scale across upcoming phases (Auth, Will, Vault, AI Snapshot).
 * ============================================================
 */

// 1. Load environment variables from .env file first
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const testRoutes = require('./routes/testRoutes');
const authRoutes = require('./routes/auth');
const willRoutes = require('./routes/will');
const lettersRoutes = require('./routes/letters');

// 2. Initialize the Express application
const app = express();

// 3. Port configuration (default to 5000 if not specified)
const PORT = process.env.PORT || 5000;

// 4. Configure CORS (Cross-Origin Resource Sharing)
// Allows our React frontend (running on port 5173 during Vite dev) to communicate with this API
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('CORS policy: Not allowed by CORS configuration.'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 5. Built-in body parser middleware to read JSON and URL-encoded bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 6. Connect to MongoDB Atlas
connectDB();

// 7. Root Welcome Route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    appName: 'AI Digital Legacy Manager API',
    version: '1.0.0',
    theme: 'Dark & Mysterious (#0a0a0f / #6b21a8)',
    docs: {
      healthCheck: '/api/test/health',
      echoTest: '/api/test/echo (POST)',
    },
    note: 'Secure digital legacy platform backend. Connect via frontend or REST client.',
  });
});

// 8. Register API Routes
// Phase 1: Test & Connectivity route
app.use('/api/test', testRoutes);

// Phase 2: Authentication routes (signup, login, me)
app.use('/api/auth', authRoutes);

// Phase 3: Digital Will & Future Letters
app.use('/api/will', willRoutes);
app.use('/api/letters', lettersRoutes);

// (Future phases will mount:
// app.use('/api/vault', vaultRoutes);
// app.use('/api/ai', aiRoutes); // Gemini 2.5 Flash backend routes
// )

// 9. 404 Route Handler for undefined endpoints
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// 10. Global Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('🔥 [Unhandled Error]:', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// 11. Start Express Server
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🌌 AI DIGITAL LEGACY MANAGER - BACKEND ONLINE`);
  console.log(`======================================================`);
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  console.log(`🩺 Health check URL:  http://localhost:${PORT}/api/test/health`);
  console.log(`🎨 Theme:             Dark & Mysterious (#0a0a0f)`);
  console.log(`🔒 Mode:              ${process.env.NODE_ENV || 'development'}`);
  console.log(`======================================================\n`);
});

