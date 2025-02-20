const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const serverless = require('serverless-http');

// Create Express app
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Default route to test deployment
app.get('/', (req, res) => {
  res.send("Hello from the WhatsApp Clone Backend!");
});

// Connect to MongoDB (using the environment variable if set)
const MONGODB_URI = "mongodb+srv://radicalzsow:Uuq5MvlJtQz8VZZY@sfm-chat.c2cf8.mongodb.net/?retryWrites=true&w=majority&appName=sfm-chat";
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB Atlas"))
.catch(err => console.error("MongoDB connection error:", err));

// Import and register other routes
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const fileRoutes = require('./routes/file');
const aiRoutes = require('./routes/ai');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);

// Export as a serverless function handler
module.exports.handler = serverless(app);
