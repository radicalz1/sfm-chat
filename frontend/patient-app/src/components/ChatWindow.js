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
