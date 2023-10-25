"use client";

import { useState } from "react";
import ViewPatientMedicineHistoryForm from "/app/pages/components/ViewPatientMedicineHistoryForm"
export default function ViewPatientMedicineHistory() {
  const [historyItems, setHistoryItems]=useState([])
  return (

    <ViewPatientMedicineHistoryForm
      historyItems={historyItems} setHistoryItems={setHistoryItems} />

  );
}