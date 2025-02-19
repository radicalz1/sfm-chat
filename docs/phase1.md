Below is the complete “Phase 1” package for your project. This includes all the documentation files, diagrams (using Mermaid for the architecture), folder structure suggestions, and even a basic CI/CD configuration with a sample .gitignore file. You can copy each file’s contents into your project repository. If you need help setting up any of these files, just ask which one.

---

### 1. requirements.md

```markdown
# Requirements

**Project Title:** WhatsApp Clone for Patient-Pharmacist Communication

## Overview
This project is a web-based communication platform that clones WhatsApp’s style and functionality—but with two separate interfaces:
- **Patient App:** A simple chat interface where patients text or send media (voice, images, PDFs) to their pharmacist.
- **Pharmacist App:** A dashboard featuring a chat list to choose among multiple patients. For each patient, there are two chat windows:
  - **Direct Chat:** For live conversation with the patient.
  - **AI Chat:** For AI-powered insights (triggered after 5 minutes idle or immediately when errors are detected).

## Key Features
- **Real-time Chat:** Uses WebSockets and RESTful APIs.
- **Media Processing:** Non-text messages are automatically transcribed (voice) or processed via OCR (images/PDFs) using Kluster AI.
- **AI Insights:** If no new messages arrive within 5 minutes, the AI performs a deep research analysis on recent scientific findings relative to the conversation and sends recommendations to the pharmacist. Additionally, it continuously monitors for context or factual errors to alert the pharmacist immediately.
- **Individual AI Instances:** Each patient conversation gets its own AI process for individualized context.
- **Token Tracking & API Rotation:** The system tracks the token usage for AI services. When limits are nearing, it will automatically use the next API key from a list—and alert the admin.
- **Future-Readiness:** Designed for future integration of voice/video calls, webinars, and a complete patient health dashboard (with features such as health journals, blood test charts, medication schedules, gamification, invoicing, etc).

## System Modules
1. **Frontend:** Two separate UIs (Patient and Pharmacist) built with a modern JavaScript framework (e.g., React) and styled with a beautiful dark theme.
2. **Backend:** A Node.js/Express server that handles:
   - REST APIs and WebSocket communications.
   - Chat, file upload, and scheduling endpoints.
3. **AI Integration & Media Processing:** A module that communicates with Kluster AI (and complementary free tools) to process media files and generate insights.
4. **Token Management:** Middleware to track token usage, auto-rotate API keys, and notify the admin.
5. **Data Archiving:** Summarization and long-term storage of conversations for context and future reference.
```

---

### 2. UserStories.md

```markdown
# User Stories

## Patient App
- **US-01:** As a patient, I want a clean, simple chat window so that I can easily send text or multimedia messages.
- **US-02:** As a patient, I want to be able to send voice messages, images, and PDF files so that I can share a range of information.
- **US-03:** As a patient, I want my conversation history to be archived and summarized for future reference.

## Pharmacist App
- **US-04:** As a pharmacist, I want to see a chat list of my patients (similar to WhatsApp) so I can easily switch between conversations.
- **US-05:** As a pharmacist, I want a dual chat window for each active conversation:
  - One for direct messaging with the patient.
  - One exclusively for AI insights and recommendations.
- **US-06:** As a pharmacist, I want the AI to monitor conversations and alert me immediately if there is any mistaken or out-of-context information.
- **US-07:** As a pharmacist, I want the AI to perform a deep research analysis after 5 minutes of chat inactivity and send me recommendations.
- **US-08:** As a pharmacist, I want each patient conversation to have its own dedicated AI instance to maintain proper context.
```

---

### 3. architecture.md (Mermaid Diagram)

```markdown
# System Architecture Diagram

Below is a Mermaid diagram representing the overall system architecture. You can paste this into a Mermaid live editor (or VSCode with Mermaid support) to view the diagram.

```mermaid
flowchart TD
    A[Patient App (React)] -->|WebSocket/REST| B[Backend Server (Node.js/Express)]
    C[Pharmacist App (React)] -->|WebSocket/REST| B
    B --> D[Database (MongoDB / PostgreSQL)]
    B --> E[Media Processing Service]
    E --> F[Kluster AI (Transcription & OCR)]
    B --> G[AI Integration Module]
    G --> F
    G --> H[Token Tracking & API Rotation]
    B --> I[Admin Panel for Monitoring]
    
    subgraph Frontend
      A
      C
    end
    
    subgraph Backend
      B
      E
      G
      H
      I
    end
```

*Note: Save this file as `architecture.md` or export the diagram as an image (PNG) once satisfied.*
```

---

### 4. API_Design.md

```markdown
# API Design

## Base URL
`https://your-domain.com/api`

## Endpoints

### 1. Authentication
- **POST /api/auth/signup**  
  **Description:** Register a new user.  
  **Request Body:**  
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "role": "patient" | "pharmacist" | "admin"
  }
  ```  
  **Response:** Confirmation message and user details.

- **POST /api/auth/login**  
  **Description:** Login and retrieve a JWT token.  
  **Request Body:**  
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```  
  **Response:** JWT token and user data.

### 2. Chat Messaging
- **GET /api/chats**  
  **Description:** Retrieve the list of chats for the logged-in user.  
  **Response:** Array of chat objects.

- **GET /api/chats/:chatId**  
  **Description:** Retrieve the messages for a specific chat.  
  **Response:** Array of message objects.

- **POST /api/chats/:chatId/messages**  
  **Description:** Send a new message in the specified chat.  
  **Request Body:**  
  ```json
  {
    "message": "string",
    "type": "text" | "file",
    "fileUrl": "string (optional, if type is file)"
  }
  ```  
  **Response:** Confirmation and message details.

### 3. File Upload and Media Processing
- **POST /api/files/upload**  
  **Description:** Upload voice, image, or PDF files (multipart/form-data).  
  **Form Data:**  
  - `file`: (binary file)  
  - `chatId`: (ID of the associated chat)  
  **Response:** File URL, file type, and processing status.

### 4. AI Trigger & Recommendations
- **POST /api/ai/trigger**  
  **Description:** Trigger AI analysis either after 5 minutes idle or manually.  
  **Request Body:**  
  ```json
  {
    "chatId": "string"
  }
  ```  
  **Response:** AI’s recommendations (only accessible by pharmacists).

### 5. Token and API Key Management (Admin)
- **GET /api/admin/tokens**  
  **Description:** Get the current token usage and status of API keys.

- **POST /api/admin/tokens/rotate**  
  **Description:** Rotate to a new API key when token limits are reached.  
  **Request Body:**  
  ```json
  {
    "currentKey": "string",
    "newKey": "string"
  }
  ```  
  **Response:** Status message indicating success or failure.
```

---

### 5. DataModels.md

```markdown
# Data Models

## 1. User Model
```json
{
  "id": "ObjectId",
  "username": "string",
  "email": "string",
  "passwordHash": "string",
  "role": "patient" | "pharmacist" | "admin",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## 2. Chat Model
```json
{
  "id": "ObjectId",
  "participants": ["UserId1", "UserId2"],
  "latestMessage": "MessageId",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## 3. Message Model
```json
{
  "id": "ObjectId",
  "chatId": "ObjectId",
  "senderId": "UserId",
  "message": "string",
  "type": "text" | "file",
  "fileUrl": "string (if type is file)",
  "timestamp": "timestamp",
  "processed": "boolean (true if AI processing completed)"
}
```

## 4. File Model
```json
{
  "id": "ObjectId",
  "chatId": "ObjectId",
  "fileType": "voice" | "image" | "pdf",
  "fileUrl": "string",
  "transcription": "string (for voice files)",
  "ocrText": "string (for images/PDFs)",
  "uploadedAt": "timestamp"
}
```

## 5. Token Usage Log Model
```json
{
  "id": "ObjectId",
  "apiKey": "string",
  "tokenCount": "number",
  "timestamp": "timestamp"
}
```
```

---

### 6. StyleGuide.md

```markdown
# Style Guide

## Color Palette
- **Background Color:** #121212
- **Primary Text Color:** #E0E0E0
- **Secondary Text Color:** #B0B0B0
- **Accent Color:** #BB86FC
- **Error Color:** #CF6679
- **Success Color:** #03DAC6

## Typography
- **Primary Font:** "Roboto", sans-serif
- **Font Sizes:**
  - Headings: 24px–32px
  - Body text: 16px
  - Small text: 12px

## Spacing
- Use increments of 8px (e.g., 8px, 16px, 24px, etc.) for margins and padding.

## Buttons
- **Primary Button:**  
  - Background: #BB86FC  
  - Text Color: #121212  
  - Border Radius: 4px
- **Secondary Button:**  
  - Transparent background  
  - 1px solid #BB86FC  
  - Text Color: #BB86FC

## Icons & Imagery
- Use clean, vector-based icons.
- Ensure high contrast for accessibility.
```

---

### 7. DeploymentPlan.md

```markdown
# Deployment Plan

## Cloud Hosting
- **Frontend:**  
  Host the React-based patient and pharmacist apps on free hosting platforms such as Vercel or Netlify.
- **Backend:**  
  Deploy the Node.js/Express server on Heroku (free dynos) or Render.
- **Database:**  
  Use MongoDB Atlas (free tier) or a free PostgreSQL host.
- **File Storage:**  
  Use Firebase Storage or AWS S3 on the free tier for uploaded media.

## CI/CD
- Set up continuous integration with GitHub Actions (see the provided CI configuration below).
- Automatically run tests and linters on push/PR.
- Deploy automatically when merging to the main branch.

## Future Scalability
- Consider containerizing services using Docker.
- Plan to migrate to orchestration tools like Kubernetes if scaling demands.
```

---

### 8. RiskAnalysis.md

```markdown
# Risk Analysis & Contingency Planning

## Identified Risks
1. **Kluster AI Integration:**
   - **Risk:** API integration might break due to changes or service downtime.
   - **Mitigation:** Implement error handling, retries, and a fallback mechanism (API key rotation).

2. **Token Limit Exhaustion:**
   - **Risk:** Exceeding AI API token limits could disrupt service.
   - **Mitigation:** Track token usage accurately, auto-rotate API keys, and notify the admin in advance.

3. **Performance Under Load:**
   - **Risk:** High concurrent usage may slow down real-time chat and processing.
   - **Mitigation:** Optimize WebSocket usage, perform load-testing, and plan horizontal scaling.

4. **Security and Data Privacy:**
   - **Risk:** Sensitive medical and personal data could be exposed.
   - **Mitigation:** Use encryption (TLS for data in transit, encryption at rest), secure authentication, and follow best practices for healthcare data.

5. **Compliance Requirements:**
   - **Risk:** Non-compliance with regulations (HIPAA, GDPR) may lead to legal issues.
   - **Mitigation:** Design with compliance in mind (data anonymization, audit logging) and consult legal guidelines.

## Contingency Strategies
- Maintain detailed logs and alerts.
- Prepare rollback plans for releases.
- Allocate time for emergency fixes.
```

---

### 9. ProjectTimeline.md

```markdown
# Project Timeline & Milestones (Phase 1)

## Week 1
- **Day 1–2:**  
  - Write Requirements Document (`requirements.md`)  
  - Define User Stories & Workflows (`UserStories.md`)
- **Day 3–5:**  
  - Create UI/UX Wireframes for Patient and Pharmacist apps (use Figma, Sketch, etc.)  
  - Write the Style Guide (`StyleGuide.md`)
- **Day 6–7:**  
  - Develop Preliminary API Design (`API_Design.md`) and Data Models (`DataModels.md`)
  - Write Risk Analysis (`RiskAnalysis.md`)

## Week 2
- **Day 8–9:**  
  - Draw the System Architecture Diagram (`architecture.md`)
- **Day 10:**  
  - Setup Repository & Define Folder Structure (see below)
- **Day 11–12:**  
  - Configure Development Environment (install Node.js, Git, VSCode)  
  - Document Deployment Plan (`DeploymentPlan.md`)
- **Day 13–14:**  
  - Set up Basic CI/CD Pipeline and create a `.gitignore` file  
  - Final review and consolidation of all documents (`ProjectTimeline.md`)
```

---

### 10. README.md

```markdown
# WhatsApp Clone for Patient-Pharmacist Communication

## Overview
This project is a messaging platform that mimics WhatsApp, tailored for healthcare use. It features:

- **Patient App:** A simple chat interface for patients.
- **Pharmacist App:** A dashboard for managing patient messages with a dual chat view for direct conversations and AI recommendations.

## Key Features
- Real-time messaging using REST/WebSocket.
- Media processing (voice, image, PDF) with transcription/OCR.
- AI-driven context analysis and proactive recommendations.
- Token usage tracking and API key rotation for AI services.
- Fully prepared for future expansions like voice/video calls and full health dashboards.

## Documentation
Please refer to the `/docs` folder for:
- Requirements (`requirements.md`)
- User Stories (`UserStories.md`)
- Architecture Diagram (`architecture.md`)
- API Design (`API_Design.md`)
- Data Models (`DataModels.md`)
- Style Guide (`StyleGuide.md`)
- Deployment Plan (`DeploymentPlan.md`)
- Risk Analysis (`RiskAnalysis.md`)
- Project Timeline (`ProjectTimeline.md`)

## Folder Structure
```
/project-root
  ├── /frontend
  │     ├── /patient-app
  │     └── /pharmacist-app
  ├── /backend
  │     ├── /chat-service
  │     ├── /media-processing
  │     └── /ai-integration
  └── /docs
         ├── requirements.md
         ├── UserStories.md
         ├── architecture.md
         ├── API_Design.md
         ├── DataModels.md
         ├── StyleGuide.md
         ├── DeploymentPlan.md
         ├── RiskAnalysis.md
         └── ProjectTimeline.md
```

## CI/CD
A basic CI/CD workflow is set up using GitHub Actions. See `.github/workflows/ci.yml` for details.

## Getting Started
1. Install Node.js (v16 or later) and Git.
2. Clone the repository.
3. Follow the documentation in `/docs` to set up the development environment.
```

---

### 11. .gitignore

```gitignore
# Node.js .gitignore

# Logs
logs
*.log
npm-debug.log*

# Dependency directories
node_modules/

# npm cache directory
.npm

# REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Environment variables
.env

# OS generated files
.DS_Store
Thumbs.db
```

---

### 12. .github/workflows/ci.yml

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'

      - name: Install Dependencies
        run: npm install

      - name: Run Lint
        run: npm run lint

      - name: Run Tests
        run: npm test
```

---

### Final Notes

1. **Folder Structure:**  
   Create your repository with the structure suggested in the README so that all documentation lives under `/docs`, while front-end and back-end code are separated.

2. **Getting Started:**  
   Even if you’re new to development, these documents serve as a roadmap. Start by setting up a Git repository, copying in these files, and following the instructions one step at a time.

3. **Next Steps:**  
   Once you have these files in your repository, we can move on to setting up minimal code for the frontend and backend. If you need additional guidance (like a starter project for a React app or an Express server), just let me know which part you’re ready to code next.

This complete package for Phase 1 provides all the necessary documentation, code snippets, and instructions to kick off your project. Happy coding!
