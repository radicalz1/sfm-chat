Below is a complete “Phase 3” package reworked to run entirely in a cloud/serverless environment. In this package you won’t need to run or manage any local servers at all. All endpoints are written in an Express‑style API but wrapped with the serverless‑http adapter so you can deploy them on a serverless platform (for example, Vercel, Netlify, or AWS Lambda). In addition, the MongoDB connection now uses an environment variable (for a cloud‑hosted MongoDB Atlas instance), and any file uploads should be configured for cloud storage (or you may integrate a service like Cloudinary).

Below you’ll find:

• A revised backend folder structure  
• Complete code files (with environment‑based configuration)  
• A separate scheduled (cron) function file that you can deploy as a scheduled serverless function using your cloud provider’s scheduling features

──────────────────────────────
### Folder Structure

Place these files in your backend folder as follows:

```
/backend
  ├── package.json
  ├── server.js
  ├── /routes
  │      ├── auth.js
  │      ├── chat.js
  │      ├── file.js
  │      ├── ai.js
  │      └── admin.js
  ├── /models
  │      ├── User.js
  │      ├── Chat.js
  │      ├── Message.js
  │      ├── File.js
  │      └── TokenUsageLog.js
  ├── /middleware
  │      ├── authMiddleware.js
  │      └── tokenTracking.js
  └── /scheduler
         └── idleTrigger.js
```

──────────────────────────────
### 1. package.json  
This file now includes the dependency “serverless-http” and does not use any local‑only modules (like node‑cron in the API). You’ll run the scheduler as a separate scheduled function via your cloud provider.

```json
{
  "name": "backend",
  "version": "1.0.0",
  "description": "Serverless backend for WhatsApp clone project",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "jsonwebtoken": "^8.5.1",
    "mongoose": "^6.7.0",
    "multer": "^1.4.5",
    "serverless-http": "^2.7.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.7"
  }
}
```

──────────────────────────────
### 2. server.js  
This is your Express app. Notice that the MongoDB connection string is now set via an environment variable (MONGODB_URI) and the app is wrapped using serverless‑http.

```javascript
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
```

––––––––––––––––––––––––––––––––––––––––––
### 3. API Routes

All routes remain essentially the same as before but will now be served via your serverless deployment.

#### a) /routes/auth.js

```javascript
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      email,
      passwordHash: hashedPassword,
      role
    });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

module.exports = router;
```

#### b) /routes/chat.js

```javascript
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
```

#### c) /routes/file.js  
*Note:* In a production serverless environment you should use a cloud storage service (such as AWS S3, Cloudinary, or Firebase Storage) instead of local disk storage. This example uses multer with a disk storage option for illustration purposes.

```javascript
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
```

#### d) /routes/ai.js

```javascript
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Dummy AI analysis function (to be replaced with real integrations to Kluster AI or similar)
const performAIAnalysis = async (chatId) => {
  // In a real implementation, send conversation data to your AI service.
  return { recommendations: `AI analysis recommendations for chat ${chatId}` };
};

// POST /api/ai/trigger – Trigger AI analysis for a chat
router.post('/trigger', authMiddleware, async (req, res) => {
  try {
    const { chatId } = req.body;
    const analysisResult = await performAIAnalysis(chatId);
    res.status(200).json({ message: 'AI analysis completed', data: analysisResult });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

module.exports = router;
```

#### e) /routes/admin.js

```javascript
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
```

──────────────────────────────
### 4. Mongoose Data Models

These models remain the same as before.

#### a) /models/User.js

```javascript
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['patient', 'pharmacist', 'admin'], default: 'patient' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
```

#### b) /models/Chat.js

```javascript
const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', ChatSchema);
```

#### c) /models/Message.js

```javascript
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
```

#### d) /models/File.js

```javascript
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
```

#### e) /models/TokenUsageLog.js

```javascript
const mongoose = require('mongoose');

const TokenUsageLogSchema = new mongoose.Schema({
  apiKey: { type: String, required: true },
  tokenCount: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TokenUsageLog', TokenUsageLogSchema);
```

──────────────────────────────
### 5. Middleware

#### a) /middleware/authMiddleware.js

```javascript
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Expect the token in the header as "Bearer <token>"
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.user = decoded; // contains { id, role, ... }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
```

#### b) /middleware/tokenTracking.js  
*(This middleware is a placeholder where you could implement logic to track token usage for your AI APIs.)*

```javascript
// Placeholder token tracking middleware – implement real logic as needed.
const TokenUsageLog = require('../models/TokenUsageLog');

module.exports = async (req, res, next) => {
  // Example: Update token usage here if handling AI API calls.
  next();
};
```

──────────────────────────────
### 6. Scheduler (Idle Chat Checker)

Because you prefer a fully managed cloud solution, you should deploy this file as a scheduled serverless function using your provider’s cron‑job or scheduled function feature (for example, Vercel Cron Jobs or AWS EventBridge).

#### /scheduler/idleTrigger.js

```javascript
const Chat = require('../models/Chat');
const Message = require('../models/Message');

// This function should be invoked on a schedule (e.g., every minute) via your cloud provider's scheduler.
// It checks for chats with no new messages for over 5 minutes and (for example) logs an event or triggers AI analysis.
module.exports = async () => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60000);
    const idleChats = await Chat.find().populate('latestMessage');
    idleChats.forEach(async (chat) => {
      if (chat.latestMessage && chat.latestMessage.timestamp < fiveMinutesAgo) {
        console.log(`Chat ${chat._id} is idle. Triggering AI analysis...`);
        // Insert your AI analysis logic here.
      }
    });
  } catch (err) {
    console.error("Error during idle check:", err);
  }
};
```

──────────────────────────────
### 7. Documentation for Cloud/Serverless Deployment

#### /docs/Phase3_Overview.md

```markdown
# Phase 3: Cloud-Based, Serverless Backend Services

## Overview

This package implements all core backend services as a serverless API using an Express app wrapped by `serverless-http`. By deploying on a serverless provider you will not manage any local servers. Key points:

- **Database:**  
  Use a cloud-hosted MongoDB Atlas instance. Set the connection string via the environment variable `MONGODB_URI`.

- **Authentication & API Endpoints:**  
  Standard endpoints for signup/login, chat messaging, file uploads, AI triggers, and admin functions.

- **Deployment:**  
  Deploy the backend as a serverless function (for example, via Vercel, Netlify, or AWS Lambda/API Gateway).  
  Make sure to set up environment variables such as `MONGODB_URI` and `JWT_SECRET` on your hosting platform.

- **Scheduled Function:**  
  The idle chat checker in `/scheduler/idleTrigger.js` should be deployed as a scheduled function (using your provider’s scheduling feature).

## Setup & Deployment

1. **Configure Environment Variables:**  
   - `MONGODB_URI`: Your MongoDB Atlas connection string.  
   - `JWT_SECRET`: A secure secret used for signing JWT tokens.
   
2. **Install Dependencies:**  
   From the `/backend` directory, run:
   ```
   npm install
   ```

3. **Deploy as a Serverless Function:**  
   - For **Vercel**:  
     Place your code in a repository and deploy it. Vercel will automatically detect and deploy your serverless function (the exported `handler` in `server.js`).  
     Configure environment variables in the Vercel dashboard.
     
   - For **AWS Lambda**:  
     Use a framework such as the Serverless Framework to deploy this Express app (wrapped by `serverless-http`) as a Lambda function behind API Gateway.

4. **Deploy Scheduled Function:**  
   Create a separate scheduled function on your cloud provider that imports and runs `/scheduler/idleTrigger.js` on your desired schedule (e.g., every minute).

Happy deploying!
```

#### /docs/README_phase3.md

```markdown
# Phase 3 – Cloud/Serverless Backend Services

This package contains all backend code for the WhatsApp clone project. It is built to run in a serverless environment so that you never have to manage any local servers.

## Getting Started

1. **Clone the Repository**  
   Make sure your backend code is in the `/backend` directory.

2. **Install Dependencies**  
   Navigate to `/backend` and run:
   ```
   npm install
   ```

3. **Set Environment Variables**  
   In your cloud hosting dashboard, set:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: Your secret for JWT signing.

4. **Deploy the Backend**  
   Deploy the code as a serverless function. For example, if using Vercel, simply push your repository and Vercel will deploy the function (from the exported handler in `server.js`).

5. **Set Up the Scheduler**  
   Use your cloud provider’s scheduled function features to deploy `/scheduler/idleTrigger.js` so it runs periodically (e.g., every minute).

6. **Test the Endpoints**  
   Use tools such as Postman to call your APIs at `<your-deployment-url>/api/auth`, `<your-deployment-url>/api/chats`, etc.

Enjoy your fully managed, cloud‑based backend!
```

──────────────────────────────
### Final Notes

• **Cloud Storage for Files:**  
  In production, replace the local file storage in `/routes/file.js` with a cloud storage integration.

• **Environment Configuration:**  
  Do **not** hardcode sensitive information. Use your cloud platform’s environment variable system (for example, Vercel’s dashboard or AWS Secrets Manager).

• **Serverless Scheduling:**  
  For the idle chat check, plan to deploy `/scheduler/idleTrigger.js` as a scheduled (cron) function using your provider’s built‑in scheduler.

This complete Phase 3 package now meets your requirements for a fully cloud‑hosted, serverless backend solution without any local server management. If you need further modifications or more detailed guidance on any deployment step, just let me know!
