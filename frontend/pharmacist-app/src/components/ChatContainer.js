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
