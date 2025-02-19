Below is the complete “Phase 4” package. In this phase you’ll add comprehensive automated tests for your cloud‑based, serverless backend (using Jest and Supertest), along with documentation and instructions for QA and security best practices. Simply copy each file’s content into your project folder. (For clarity, we assume your cloud‑deployment code now resides in the `/backend` folder.)

──────────────────────────────
### Updated Folder Structure

Make sure your `/backend` folder has this structure now (new additions in **/tests** and **/docs**):

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
  ├── /scheduler
  │      └── idleTrigger.js
  ├── /tests
  │      ├── auth.test.js
  │      ├── chat.test.js
  │      ├── file.test.js
  │      ├── ai.test.js
  │      └── admin.test.js
  └── /docs
         ├── Phase4_Overview.md
         └── README_phase4.md
```

──────────────────────────────
### 1. Update package.json for Testing

Update your **/backend/package.json** to include the testing frameworks in devDependencies and to add a test script. (If they are not already added, simply copy/paste these additions.)

```json
{
  "name": "backend",
  "version": "1.0.0",
  "description": "Serverless backend for WhatsApp clone project",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest --verbose"
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
    "nodemon": "^2.0.7",
    "jest": "^29.0.0",
    "supertest": "^6.3.0"
  }
}
```

──────────────────────────────
### 2. Update the Server Entry Point for Testing

For testing purposes (so your test files can run requests against your Express app directly), update your **/backend/server.js** to export the Express app along with the serverless handler. (Add the extra export near the end of the file.)

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

// Export the app for testing and the serverless handler for deployment
module.exports.handler = serverless(app);
module.exports.app = app;
```

──────────────────────────────
### 3. Automated Tests (Using Jest & Supertest)

Create a new folder **/backend/tests** and add the following test files. These tests cover your authentication, chat, file upload, AI, and admin endpoints.

#### a) **/backend/tests/auth.test.js**

```javascript
const request = require('supertest');
const app = require('../server').app;

describe('Auth API', () => {
  let testEmail = `testuser${Date.now()}@example.com`;
  let testPassword = "test123";
  let token;

  test('Signup new user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
         username: "TestUser",
         email: testEmail,
         password: testPassword,
         role: "patient"
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.user).toHaveProperty('_id');
  });

  test('Login user and return token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
         email: testEmail,
         password: testPassword
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });
});
```

#### b) **/backend/tests/chat.test.js**

```javascript
const request = require('supertest');
const app = require('../server').app;

describe('Chat API', () => {
  let token;

  beforeAll(async () => {
    // Create a dummy user and obtain a token for testing chats
    const resSignup = await request(app)
      .post('/api/auth/signup')
      .send({
         username: "ChatTester",
         email: `chattester${Date.now()}@example.com`,
         password: "test123",
         role: "patient"
      });
    const resLogin = await request(app)
      .post('/api/auth/login')
      .send({
         email: resSignup.body.user.email,
         password: "test123"
      });
    token = resLogin.body.token;
  });
  
  test('GET /api/chats returns an array', async () => {
    const res = await request(app)
      .get('/api/chats')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
```

#### c) **/backend/tests/file.test.js**

Make sure to add a sample file (for example, **sample.txt**) inside the **/backend/tests/** folder.

```javascript
const request = require('supertest');
const path = require('path');
const app = require('../server').app;

describe('File Upload API', () => {
  let token;

  beforeAll(async () => {
    const resSignup = await request(app)
      .post('/api/auth/signup')
      .send({
         username: "FileTester",
         email: `filetester${Date.now()}@example.com`,
         password: "test123",
         role: "patient"
      });
    const resLogin = await request(app)
      .post('/api/auth/login')
      .send({
         email: resSignup.body.user.email,
         password: "test123"
      });
    token = resLogin.body.token;
  });

  test('POST /api/files/upload successfully uploads a file', async () => {
    const res = await request(app)
      .post('/api/files/upload')
      .set('Authorization', `Bearer ${token}`)
      .field('chatId', 'dummyChatId')
      .attach('file', path.join(__dirname, 'sample.txt'));
    expect(res.statusCode).toEqual(201);
    expect(res.body.file).toHaveProperty('fileUrl');
  });
});
```

#### d) **/backend/tests/ai.test.js**

```javascript
const request = require('supertest');
const app = require('../server').app;

describe('AI Trigger API', () => {
  let token;

  beforeAll(async () => {
    const resSignup = await request(app)
      .post('/api/auth/signup')
      .send({
         username: "AITester",
         email: `aitester${Date.now()}@example.com`,
         password: "test123",
         role: "pharmacist" // needed for AI-specific endpoints
      });
    const resLogin = await request(app)
      .post('/api/auth/login')
      .send({
         email: resSignup.body.user.email,
         password: "test123"
      });
    token = resLogin.body.token;
  });

  test('POST /api/ai/trigger returns AI analysis', async () => {
    const res = await request(app)
      .post('/api/ai/trigger')
      .set('Authorization', `Bearer ${token}`)
      .send({ chatId: 'dummyChatId' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty('recommendations');
  });
});
```

#### e) **/backend/tests/admin.test.js**

```javascript
const request = require('supertest');
const app = require('../server').app;

describe('Admin API', () => {
  let token;

  beforeAll(async () => {
    // Create an admin user for testing
    const email = `admin${Date.now()}@example.com`;
    const resSignup = await request(app)
      .post('/api/auth/signup')
      .send({
         username: "AdminUser",
         email: email,
         password: "admin123",
         role: "admin"
      });
    const resLogin = await request(app)
      .post('/api/auth/login')
      .send({
         email: email,
         password: "admin123"
      });
    token = resLogin.body.token;
  });

  test('GET /api/admin/tokens returns token logs', async () => {
    const res = await request(app)
      .get('/api/admin/tokens')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
```

──────────────────────────────
### 4. Documentation for Testing, QA & Security

#### a) **/docs/Phase4_Overview.md**

```markdown
# Phase 4: Testing, QA & Security

## Overview

In this phase, we add comprehensive testing and quality assurance to the backend along with security best practices. Key points include:

- **Automated Testing:**  
  Unit and integration tests are written using Jest and Supertest. All tests are located in the `/tests` folder.
  
- **Security Enhancements:**  
  - Use of environment variables for sensitive data (e.g., `MONGODB_URI`, `JWT_SECRET`).
  - Input validation (consider adding further validation as needed).
  - Proper CORS settings.
  - (Optional) Consider integrating additional security middleware such as Helmet for enhanced HTTP header protection.
  
- **CI/CD Integration:**  
  The CI/CD pipeline (e.g. using GitHub Actions) should run these tests on every push and pull request.

## How to Run the Tests

1. Ensure that you have installed all dependencies:
   ```
   npm install
   ```
2. From the `/backend` directory, run:
   ```
   npm test
   ```
3. All test files in `/tests` will execute automatically, and you will see detailed output in your terminal.

## Recommended QA Practices

- **Code Coverage:** Configure code coverage reports with Jest to ensure all routes, middleware, and models are tested.
- **Linting & Formatting:** Use ESLint and Prettier to maintain code quality.
- **Vulnerability Scanning:** Consider integrating automated dependency scanning (e.g., npm audit) to catch vulnerabilities early.

Happy testing and secure coding!
```

#### b) **/docs/README_phase4.md**

```markdown
# Phase 4 – Testing, QA & Security

This package contains all tests and quality assurance documentation for the backend part of the WhatsApp clone project.

## Setup

1. Navigate to your `/backend` folder.
2. Install all dependencies with:
   ```
   npm install
   ```
3. Set the required environment variables in your cloud deployment:
   - `MONGODB_URI` (your MongoDB Atlas connection string)
   - `JWT_SECRET` (a secure secret for JWT signing)

## Running Tests Locally

Run the following command from the `/backend` directory:
```
npm test
```
This will execute all Jest tests located in `/tests`.

## Security Recommendations

- Always use environment variables to store sensitive data.
- Validate and sanitize all user inputs.
- For file uploads, implement proper file type/size validations.
- Use security middleware (e.g., Helmet) to add extra HTTP header security.

## CI/CD

Your CI/CD pipeline should run these tests on every commit. Check the configuration in `.github/workflows/ci.yml`.

Enjoy your fully tested and secure backend!
```

──────────────────────────────
### Final Notes

• **Running in a Cloud Environment:**  
  Since your backend is deployed using serverless technologies, the tests below run against your local copy of the Express app (exported from `server.js`). When deploying, ensure your cloud environment is configured with all required environment variables.

• **Security Improvements:**  
  As you extend the project, consider adding input validation libraries (like Joi) and security middleware (like Helmet) to your Express app.

• **CI/CD Integration:**  
  You already have a basic CI/CD configuration from Phase 1. Integrate these tests so that every commit is verified automatically.

This complete Phase 4 package provides all the necessary code for testing, quality assurance, and security documentation. If you need further guidance on any specific test or security improvement, let me know which part you’d like to drill down into next!
