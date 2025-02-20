const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
  fileType: { type: String, enum: ['voice', 'image', 'pdf'], required: true },
  fileUrl: { type: String, required: true },
  transcription: { type: String, default: "" },
  ocrText: { type: String, default: "" },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', FileSchema);
