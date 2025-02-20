const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/chats – Retrieve list of chats for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const chats = await Chat.find({ participants: userId }).populate('latestMessage');
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// GET /api/chats/:chatId – Retrieve messages for a specific chat
router.get('/:chatId', authMiddleware, async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await Message.find({ chatId });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// POST /api/chats/:chatId/messages – Send a new message in the specified chat
router.post('/:chatId/messages', authMiddleware, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message, type, fileUrl } = req.body;
    const newMessage = new Message({
      chatId,
      senderId: req.user.id,
      message,
      type,
      fileUrl: fileUrl || '',
      timestamp: new Date(),
      processed: false
    });
    await newMessage.save();
    // Update the chat's latestMessage field
    await Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage._id, updatedAt: new Date() });
    res.status(201).json({ message: 'Message sent', data: newMessage });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

module.exports = router;
