const express = require('express');
const router = express.Router();
const multer = require('multer');
const File = require('../models/File');
const authMiddleware = require('../middleware/authMiddleware');

// Configure multer storage (for cloud deployment, consider using a cloud storage adapter)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp/uploads/'); // For serverless functions, use a temporary folder or integrate with cloud storage directly.
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// POST /api/files/upload – Upload a file (voice, image, or PDF)
router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const { chatId } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const fileData = new File({
      chatId,
      fileType: req.file.mimetype.split('/')[0], // e.g., "image", "audio", "application" (for pdf)
      fileUrl: req.file.path,
      uploadedAt: new Date()
    });
    await fileData.save();
    // You can add asynchronous processing (transcription/OCR) here.
    res.status(201).json({ message: 'File uploaded', file: fileData });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

module.exports = router;
