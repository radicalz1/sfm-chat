const mongoose = require('mongoose');

const TokenUsageLogSchema = new mongoose.Schema({
  apiKey: { type: String, required: true },
  tokenCount: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TokenUsageLog', TokenUsageLogSchema);
