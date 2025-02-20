const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const serverless = require('serverless-http');

// Create Express app
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Default route for testing
app.get('/', (req, res) => {
  res.send("Hello from the WhatsApp Clone Backend!");
});

// Use environment variables for configuration (fallback provided)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/whatsapp_clone?retryWrites=true&w=majority';

// Connect to MongoDB Atlas
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("MongoDB connection error:", err));

// Import routes from separate route files
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const fileRoutes = require('./routes/file');
const aiRoutes = require('./routes/ai');
const adminRoutes = require('./routes/admin');

// Register API routes
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);

// Export the Express app as a serverless function handler for Vercel
module.exports.handler = serverless(app);
