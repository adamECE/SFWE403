"use client"
import { useEffect, useState } from "react";
import PrescriptionRow from "./PrescriptionRow";
import PopupPrescriptionItemWindow from "./PopupPrescriptionWindow";

export default function Prescription() {
  const [prescriptionItems, setPrescriptionItems] = useState([]); 
  const [popupWindow, setPopupWindow] = useState(false);
  const [popupWindowContent, setPopupWindowContent] = useState({});
  const [prescriptionUpdated, setPrescriptionUpdated] = useState(false);

  useEffect(() => {
    setPrescriptionUpdated(!prescriptionUpdated);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token"); // get auth token from localStorage
    
    
    fetch("http://127.0.0.1:3030/pharmacy-0x2/api/patientHistory/get-patient-prescription-info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // include bearer token in the Autho header
      },
      body: JSON.stringify({
        "userId":"65206dcfee249d4cdc42eb20"
      })
    })
      .then((res) => {
        if (!res.ok) {
          console.log("Here1");
          throw new Error('Network response error');
        }
        return res.json();
      })
      .then((data) => {
        //filter to only prescriptions
        //const prescriptionItems = data.filter((item)=> item.category === "prescription");
        setPrescriptionItems(data);
        console.log(data);
      })
      .catch((error) => {
        console.log("Here2");
        console.error('Fetch error:', error);
      });
  }, [prescriptionUpdated]);



  const thStyle = " px-6 py-4";
  const blockStyle = "m-5 p-5 flex flex-col justify-center items-center ";
  return (
    <div className={blockStyle}>
      <h3>Prescriptions</h3>

      {/* Only show modal if an item is clicked */}
      {popupWindow && (
        <PopupPrescriptionItemWindow
          popupWindowContent={popupWindowContent}
          setPopupWindow={setPopupWindow}
          prescriptionUpdated={prescriptionUpdated}
          setPrescriptionUpdated={setPrescriptionUpdated}
        />
      )}

      <table className="border-collapse border border-sky-700 md:table-fixed font-light mx-4 my-4">
        <thead className="border-b bg-neutral-50 font-medium dark:border-neutral-500 dark:text-neutral-800">
          <tr>
          <th scope="col" className={thStyle}>
              Delivered By
            </th>
            <th scope="col" className={thStyle}>
              Doctor Name
            </th>
            <th scope="col" className={thStyle}>
              ID
            </th>
            <th scope="col" className={thStyle}>
              Dosage
            </th>
            <th scope="col" className={thStyle}>
              Refill Due Date
            </th>
            <th scope="col" className={thStyle}>
              Refills
            </th>
          </tr>
        </thead>
        <tbody>
          {prescriptionItems.map((item) => (
            <PrescriptionRow
              key={item._id}
              _id={item._id}
              popupWindow={popupWindow}
              setPopupWindow={setPopupWindow}
              setPopupWindowContent={setPopupWindowContent}
              deliveredBy={item.deliveredBy}
              doctorName={item.doctorName}
              dosage={item.dosage}
              medicationID={item.medicationInfo._id}
              isValid={item.isValid}
              quantity={item.quantity}
              price={item.medicationInfo.price}
              medicationName = {item.medicationInfo.name}
              medicationDescription = {item.medicationInfo.description}
              medicationManufacturer = {item.medicationInfo.manufacturer}
              batches={item.filledInfo}
              refillPolicy ={item.refillPolicy.allowRefill}
              refillDueDate={item.refillPolicy.dueDate}
              refills = {item.refillPolicy.refills}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
