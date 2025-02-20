const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const serverless = require('serverless-http');

// Create Express app
const app = express();

// Use environment variables for configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/whatsapp_clone?retryWrites=true&w=majority';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB Atlas
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("MongoDB connection error:", err));

// Import routes
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const fileRoutes = require('./routes/file');
const aiRoutes = require('./routes/ai');
const adminRoutes = require('./routes/admin');

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);

// Export as serverless function handler
module.exports.handler = serverless(app);
