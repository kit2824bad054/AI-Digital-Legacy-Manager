/**
 * ============================================================
 * Test & Health Check Routes
 * ============================================================
 * Purpose: Provides simple diagnostic endpoints to verify:
 * 1. Express server is reachable by the frontend.
 * 2. MongoDB Atlas connection state.
 * 3. Environment configuration status.
 * ============================================================
 */

const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

/**
 * @route   GET /api/test/health
 * @desc    Check backend health and connectivity with frontend
 * @access  Public
 */
router.get('/health', (req, res) => {
  // Check MongoDB connection state: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const dbStateMap = {
    0: 'Disconnected (Pending Atlas URI in .env)',
    1: 'Connected to MongoDB Atlas',
    2: 'Connecting...',
    3: 'Disconnecting...',
  };

  const mongoState = mongoose.connection.readyState;
  const isMongoReady = mongoState === 1;

  // Check if Gemini API key is configured
  const hasGeminiKey = Boolean(
    process.env.GEMINI_API_KEY && 
    !process.env.GEMINI_API_KEY.includes('your_')
  );

  return res.status(200).json({
    success: true,
    message: '✨ AI Digital Legacy Manager Backend is Online & Ready!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    serverPort: process.env.PORT || 5000,
    services: {
      expressServer: 'Operational',
      mongodbAtlas: {
        connected: isMongoReady,
        status: dbStateMap[mongoState] || 'Unknown',
      },
      geminiAI: {
        configured: hasGeminiKey,
        model: 'gemini-2.5-flash (backend-only integration ready)',
      },
    },
    clientInfo: {
      origin: req.headers.origin || req.ip,
      userAgent: req.headers['user-agent'],
    },
  });
});

/**
 * @route   POST /api/test/echo
 * @desc    Test POST request payload communication between frontend and backend
 * @access  Public
 */
router.post('/echo', (req, res) => {
  const { testMessage } = req.body;
  return res.status(200).json({
    success: true,
    receivedAt: new Date().toISOString(),
    reply: `Backend received your message: "${testMessage || 'Hello from Frontend!'}"`,
    receivedPayload: req.body,
  });
});

module.exports = router;
