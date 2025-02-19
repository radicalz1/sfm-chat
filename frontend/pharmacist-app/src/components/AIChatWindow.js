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
