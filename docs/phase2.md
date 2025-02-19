Below is the complete “Phase 2” package that covers the UI/UX & Prototype Development of your project. This package includes all the documentation you need plus complete code files for two separate React‐based prototypes—one for the Patient App (a simple chat interface with file upload) and one for the Pharmacist App (a dashboard with a patient list and dual chat windows for direct conversation and AI insights).

Follow these bite‐sized instructions. If you’re not familiar with app development, simply copy each file’s content into the proper file in your project folder.

──────────────────────────────
**Folder Structure Overview**

Your folder structure for Phase 2 should look like this:

```
/project-root
  ├── /frontend
  │     ├── /patient-app
  │     │      ├── package.json
  │     │      ├── public
  │     │      │      └── index.html
  │     │      └── src
  │     │             ├── index.js
  │     │             ├── App.js
  │     │             ├── App.css
  │     │             ├── index.css
  │     │             └── /components
  │     │                    ├── ChatWindow.js
  │     │                    └── ChatWindow.css
  │     └── /pharmacist-app
  │            ├── package.json
  │            ├── public
  │            │      └── index.html
  │            └── src
  │                   ├── index.js
  │                   ├── App.js
  │                   ├── App.css
  │                   ├── index.css
  │                   └── /components
  │                          ├── PatientList.js
  │                          ├── PatientList.css
  │                          ├── ChatContainer.js
  │                          ├── ChatContainer.css
  │                          ├── ChatWindow.js
  │                          ├── ChatWindow.css
  │                          ├── AIChatWindow.js
  │                          └── AIChatWindow.css
  └── /docs
         └── Phase2_Overview.md
         └── README_phase2.md
```

──────────────────────────────
**Documentation Files**

1. **Phase2_Overview.md**

```markdown
# Phase 2: UI/UX & Prototype Development

## Overview

In this phase we build the user interfaces for both the Patient and Pharmacist apps as interactive React prototypes. The goals are:

- **Patient App:**  
  - A simple, single chat window where patients can send text messages and upload files.  
  - Beautiful dark theme styling.

- **Pharmacist App:**  
  - A dashboard with a left-side list of patients (dummy data for now).  
  - When a patient is selected, display a dual chat window: one for direct conversation and one reserved for AI recommendations.
  - Designed with a responsive, dark theme.

## Instructions

1. For the **Patient App**:
   - Navigate to `/frontend/patient-app`
   - Run:
     ```
     npm install
     npm start
     ```
   - A browser window opens displaying your simple patient chat interface.

2. For the **Pharmacist App**:
   - Navigate to `/frontend/pharmacist-app`
   - Run:
     ```
     npm install
     npm start
     ```
   - A browser window opens showing a patient list on the left. Click a patient to load the dual chat interface.

These prototypes are starter versions. Later phases will connect to the backend, add real-time messaging, and integrate AI services.

Happy prototyping!
```

2. **README_phase2.md**

```markdown
# Phase 2 Prototype – Patient & Pharmacist Apps

This package contains the UI prototypes for:

- **Patient App:** A single chat interface.
- **Pharmacist App:** A dashboard with a patient list coupled with dual chat windows (one for direct messages and one for AI recommendations).

## Folder Structure

```
/frontend
   ├── /patient-app
   └── /pharmacist-app
```

## Getting Started

### Patient App

1. Navigate to `frontend/patient-app`.
2. Run:
   ```
   npm install
   npm start
   ```
3. The app will open in your browser with a clean chat interface where you can type messages and simulate file uploads.

### Pharmacist App

1. Navigate to `frontend/pharmacist-app`.
2. Run:
   ```
   npm install
   npm start
   ```
3. The app displays a patient list on the left; click any patient to bring up a chat view that shows:
   - A **direct chat window** for messages between the pharmacist and that patient.
   - An **AI chat window** for AI recommendations and insights.

## Next Steps

- Integrate backend APIs.
- Implement WebSocket for real-time chat.
- Enhance the UI/UX based on feedback.
```

──────────────────────────────
**Patient App Code**

1. **/frontend/patient-app/package.json**

```json
{
  "name": "patient-app",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  }
}
```

2. **/frontend/patient-app/public/index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Patient App</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

3. **/frontend/patient-app/src/index.js**

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

4. **/frontend/patient-app/src/App.js**

```javascript
import React from 'react';
import ChatWindow from './components/ChatWindow';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <h1>Patient Chat</h1>
      <ChatWindow />
    </div>
  );
}

export default App;
```

5. **/frontend/patient-app/src/App.css**

```css
.app-container {
  padding: 20px;
  color: #E0E0E0;
  text-align: center;
}
```

6. **/frontend/patient-app/src/index.css**

```css
body {
  margin: 0;
  font-family: Roboto, sans-serif;
  background-color: #121212;
}
```

7. **/frontend/patient-app/src/components/ChatWindow.js**

```javascript
import React, { useState } from 'react';
import './ChatWindow.css';

function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const sendMessage = () => {
    if (inputValue.trim() !== "") {
      const newMessage = { text: inputValue, sender: "patient", id: Date.now() };
      setMessages([...messages, newMessage]);
      setInputValue("");
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newMessage = { text: `Uploaded file: ${file.name}`, sender: "patient", id: Date.now() };
      setMessages([...messages, newMessage]);
    }
  };

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input 
          type="text" 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
          placeholder="Type your message..." 
        />
        <button onClick={sendMessage}>Send</button>
        <input type="file" onChange={handleFileUpload} />
      </div>
    </div>
  );
}

export default ChatWindow;
```

8. **/frontend/patient-app/src/components/ChatWindow.css**

```css
.chat-window {
  background-color: #121212;
  color: #E0E0E0;
  margin: 20px auto;
  padding: 20px;
  border-radius: 8px;
  height: 70vh;
  max-width: 600px;
  display: flex;
  flex-direction: column;
}
.messages {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px;
}
.message {
  padding: 10px;
  margin: 5px 0;
  border-radius: 4px;
}
.message.patient {
  background-color: #333;
  align-self: flex-end;
}
.input-area {
  display: flex;
  align-items: center;
}
.input-area input[type="text"] {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 4px;
  margin-right: 5px;
  background-color: #2a2a2a;
  color: #E0E0E0;
}
.input-area button {
  background-color: #BB86FC;
  border: none;
  padding: 10px 15px;
  color: #121212;
  border-radius: 4px;
  cursor: pointer;
}
.input-area input[type="file"] {
  margin-left: 5px;
}
```

──────────────────────────────
**Pharmacist App Code**

1. **/frontend/pharmacist-app/package.json**

```json
{
  "name": "pharmacist-app",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  }
}
```

2. **/frontend/pharmacist-app/public/index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pharmacist App</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

3. **/frontend/pharmacist-app/src/index.js**

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

4. **/frontend/pharmacist-app/src/App.js**

```javascript
import React, { useState } from 'react';
import PatientList from './components/PatientList';
import ChatContainer from './components/ChatContainer';
import './App.css';

function App() {
  const [selectedPatient, setSelectedPatient] = useState(null);

  return (
    <div className="pharmacist-app">
      <PatientList onSelectPatient={setSelectedPatient} />
      {selectedPatient ? (
        <ChatContainer patient={selectedPatient} />
      ) : (
        <div className="empty-chat">
          Select a patient from the list to begin chatting.
        </div>
      )}
    </div>
  );
}

export default App;
```

5. **/frontend/pharmacist-app/src/App.css**

```css
/* Additional styles for App if necessary */
```

6. **/frontend/pharmacist-app/src/index.css**

```css
body {
  margin: 0;
  font-family: Roboto, sans-serif;
  background-color: #121212;
}
.pharmacist-app {
  display: flex;
  height: 100vh;
  color: #E0E0E0;
}
.empty-chat {
  margin: auto;
  font-size: 1.2em;
}
```

7. **/frontend/pharmacist-app/src/components/PatientList.js**

```javascript
import React from 'react';
import './PatientList.css';

const dummyPatients = [
  { id: 1, name: "Patient A" },
  { id: 2, name: "Patient B" },
  { id: 3, name: "Patient C" }
];

function PatientList({ onSelectPatient }) {
  return (
    <div className="patient-list">
      <h2>Patients</h2>
      <ul>
        {dummyPatients.map(patient => (
          <li key={patient.id} onClick={() => onSelectPatient(patient)}>
            {patient.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PatientList;
```

8. **/frontend/pharmacist-app/src/components/PatientList.css**

```css
.patient-list {
  width: 250px;
  background-color: #1e1e1e;
  padding: 20px;
  overflow-y: auto;
}
.patient-list h2 {
  margin-bottom: 10px;
}
.patient-list ul {
  list-style: none;
  padding: 0;
}
.patient-list li {
  padding: 10px;
  margin-bottom: 5px;
  cursor: pointer;
  border-radius: 4px;
}
.patient-list li:hover {
  background-color: #333;
}
```

9. **/frontend/pharmacist-app/src/components/ChatContainer.js**

```javascript
import React from 'react';
import ChatWindow from './ChatWindow';
import AIChatWindow from './AIChatWindow';
import './ChatContainer.css';

function ChatContainer({ patient }) {
  return (
    <div className="chat-container">
      <div className="patient-chat">
        <h3>Chat with {patient.name}</h3>
        <ChatWindow />
      </div>
      <div className="ai-chat">
        <h3>AI Recommendations</h3>
        <AIChatWindow />
      </div>
    </div>
  );
}

export default ChatContainer;
```

10. **/frontend/pharmacist-app/src/components/ChatContainer.css**

```css
.chat-container {
  display: flex;
  flex: 1;
  flex-direction: row;
  padding: 20px;
  gap: 20px;
}
.patient-chat, .ai-chat {
  flex: 1;
  background-color: #1e1e1e;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}
.patient-chat h3, .ai-chat h3 {
  margin-bottom: 10px;
}
```

11. **/frontend/pharmacist-app/src/components/ChatWindow.js**

```javascript
import React, { useState } from 'react';
import './ChatWindow.css';

function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const sendMessage = () => {
    if (inputValue.trim() !== "") {
      const newMessage = { text: inputValue, sender: "pharmacist", id: Date.now() };
      setMessages([...messages, newMessage]);
      setInputValue("");
    }
  };

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input 
          type="text" 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatWindow;
```

12. **/frontend/pharmacist-app/src/components/ChatWindow.css**

```css
.chat-window {
  background-color: #2a2a2a;
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 4px;
}
.messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}
.message {
  padding: 10px;
  margin: 5px 0;
  border-radius: 4px;
}
.message.pharmacist {
  background-color: #444;
  align-self: flex-end;
}
.message.patient {
  background-color: #333;
  align-self: flex-start;
}
.input-area {
  display: flex;
  padding: 10px;
}
.input-area input[type="text"] {
  flex: 1;
  padding: 8px;
  background-color: #121212;
  color: #E0E0E0;
  border: 1px solid #444;
  border-radius: 4px;
}
.input-area button {
  background-color: #BB86FC;
  color: #121212;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
}
```

13. **/frontend/pharmacist-app/src/components/AIChatWindow.js**

```javascript
import React, { useState } from 'react';
import './AIChatWindow.css';

function AIChatWindow() {
  const [aiMessages, setAiMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const sendToAI = () => {
    if (inputValue.trim() !== "") {
      const aiResponse = { text: "AI Response for: " + inputValue, id: Date.now() };
      setAiMessages([...aiMessages, aiResponse]);
      setInputValue("");
    }
  };

  return (
    <div className="ai-chat-window">
      <div className="messages">
        {aiMessages.map(msg => (
          <div key={msg.id} className="message ai">
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input 
          type="text" 
          placeholder="Ask AI..." 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
        />
        <button onClick={sendToAI}>Send</button>
      </div>
    </div>
  );
}

export default AIChatWindow;
```

14. **/frontend/pharmacist-app/src/components/AIChatWindow.css**

```css
.ai-chat-window {
  background-color: #2a2a2a;
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 4px;
}
.ai-chat-window .messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}
.ai-chat-window .message {
  padding: 10px;
  margin: 5px 0;
  border-radius: 4px;
  background-color: #555;
  align-self: flex-start;
}
.ai-chat-window .input-area {
  display: flex;
  padding: 10px;
}
.ai-chat-window .input-area input[type="text"] {
  flex: 1;
  padding: 8px;
  background-color: #121212;
  color: #E0E0E0;
  border: 1px solid #444;
  border-radius: 4px;
}
.ai-chat-window .input-area button {
  background-color: #BB86FC;
  color: #121212;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
}
```

──────────────────────────────
**Final Notes**

• To run each prototype, open a terminal:
  - For the Patient App: navigate to `/frontend/patient-app`, run `npm install` then `npm start`.
  - For the Pharmacist App: navigate to `/frontend/pharmacist-app`, run `npm install` then `npm start`.

• These prototypes use basic React components with simulated message functionality and file upload (for patients) plus a dummy patient list and dual chat windows (for pharmacists).

• In later phases, you will integrate real-time messaging (via WebSockets), backend APIs, transcription/OCR processing, and AI integration.

If you need any changes or further bite‐sized code explanations for any specific component or file modification, let me know!
