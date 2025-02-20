const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const TokenUsageLog = require('../models/TokenUsageLog');

// GET /api/admin/tokens – Retrieve token usage logs (admin only)
router.get('/tokens', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const tokenLogs = await TokenUsageLog.find({});
    res.json(tokenLogs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// POST /api/admin/tokens/rotate – Rotate API keys (admin only)
router.post('/tokens/rotate', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const { currentKey, newKey } = req.body;
    // For demonstration, create a new token usage log entry for the new API key.
    const log = new TokenUsageLog({
      apiKey: newKey,
      tokenCount: 0,
      timestamp: new Date()
    });
    await log.save();
    res.status(200).json({ message: 'API key rotated successfully', data: log });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

module.exports = router;
