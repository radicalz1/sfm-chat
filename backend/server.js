// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const serverless = require('serverless-http');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Default health-check route
app.get('/', (req, res) => {
  res.send("Hello from the WhatsApp Clone Backend!");
});

// Use the environment variable for MongoDB URI, or fallback to a local connection string.
// (Remember to set MONGODB_URI in your Vercel environment, or add a secret as needed.)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/whatsapp_clone';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

// Import API routes
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const fileRoutes = require('./routes/file');
const aiRoutes = require('./routes/ai');
const adminRoutes = require('./routes/admin');

// Mount routes on specific paths
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);

// Export the app as a serverless function handler so Vercel can deploy it properly.
module.exports.handler = serverless(app);
