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
