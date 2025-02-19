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
