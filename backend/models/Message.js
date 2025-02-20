const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String },
  type: { type: String, enum: ['text', 'file'], default: 'text' },
  fileUrl: { type: String, default: "" },
  timestamp: { type: Date, default: Date.now },
  processed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Message', MessageSchema);
