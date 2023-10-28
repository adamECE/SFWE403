'use client';

import {useState, useEffect} from 'react';

import RemovePatient from '/app/pages/components/RemovePatient';
export default function Patients() {
  const [patientList, setPatientList] = useState([]);
  return (
    <div>
      <RemovePatient
        patientList={patientList}
        setPatientList={setPatientList}
      />
    </div>
  );
}
