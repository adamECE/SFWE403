'use client'
import React, { useState } from "react";

export default function PopupPrescriptionItemWindow({
  popupWindowContent,
  setPopupWindow,
  prescriptionUpdated,
  setPrescriptionUpdated,
}) {
  const [confirmFillWindow, setConfirmFillWindow] = useState(false);
  const [itemExpired, setItemExpired] = useState(false);
  const [itemNotAvailable, setItemNotAvailable] = useState(false);
  const [itemAvailable, setItemAvailable] = useState(false);
  const [item,     setItem] = useState([]);

  const handleCloseModalBtn = (e) => {
    e.preventDefault();
    setPopupWindow(false);
    // Make sure everything else is closed
    setItemExpired(false);
    setConfirmFillWindow(false);
    setItemNotAvailable(false);
    setItemAvailable(false)
  };
  const handleCheck = async (e) => {
    const token = localStorage.getItem("token"); // get auth token from localStorage

    fetch("http://127.0.0.1:3030/pharmacy-0x2/api/inventory/get-item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // include bearer token in the Autho header
      },
      body: JSON.stringify({
        medicationName: popupWindowContent.medicationID
    })
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Network response error');
      }
      return res.json();
    })
    .then((data) => {
      setItem(data); 
      console.log(data); 
    }) 
    .catch((error) => {
      console.error('Fetch error:', error);
    }); 
    e.preventDefault();
    if(item.quantity < popupWindowContent.quantity) {
      setItemNotAvailable(true);
    }
    else {
      setItemAvailable(true);
    }
  }
  const handleFillItem = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // Get auth token from localStorage

    if (!confirmFillWindow) {
      setConfirmFillWindow(true);
    } else {
      await fetch("http://127.0.0.1:3030/pharmacy-0x2/api/patientHistory/fill-prescription", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // Specify the content type as JSON
          Authorization: `Bearer ${token}`, // Include bearer token in the Autho header
        },
        body: JSON.stringify({
          userID: popupWindowContent.patient._id,
          medicationID: popupWindowContent._id,
          barcode: popupWindowContent.barcode,
          prescriptionID: popupWindowContent.prescriptionID,
        }),
      })
        .then((res) => {
          if (res.status === 401 || res.status === 404) {
            // Let the user know the item is not expired
            setItemExpired(true);
            setConfirmFillWindow(false);
          } else {
            setPrescriptionUpdated(!prescriptionUpdated);
            setPopupWindow(false);
          }
        })
        .catch((error) => {
          console.error("Fill error:", error);
        });
    }
  };

  return (
    <div
      id="myModal"
      className="modal p-10px fixed w-full h-full top-0 left-0 flex items-center justify-center"
    >
      <div className="modal-content border-2 border-gray-800 border-opacity-100 bg-white p-8 rounded shadow-lg relative">
        <button
          className="top-0 right-0 m-2 px-4 py-2 bg-blue-500 text-white rounded absolute"
          onClick={handleCloseModalBtn}
        >
          &times;
        </button>
        <h3 className="text-black">{popupWindowContent.name}</h3>
        <div className="font-bold">Description:</div>
        <div className="border-2 px-4 py-2">
          {popupWindowContent.description}
        </div>
        <div className="px-4 py-2">
          <b>Delivered By:</b> {popupWindowContent.deliveredBy}
        </div>
        <div className="px-4 py-2">
          <b>Doctor Name:</b> {popupWindowContent.doctorName}
        </div>
        <div className="px-4 py-2">
          <b>Dosage:</b> {popupWindowContent.dosage}
        </div>
        <div className="px-4 py-2">
          <b>Quantity:</b> {popupWindowContent.quantity}
        </div>
        <div className="px-4 py-2">
          <b>Medication ID:</b> {popupWindowContent.medicationID}
        </div>
        <div className="px-4 py-2">
          <b>Medication Name:</b> {popupWindowContent.medicationName}
        </div>
        <div className="px-4 py-2">
          <b>Refills:</b> {popupWindowContent.refills}
        </div>
        {/* Render batch information
      {popupWindowContent.batches.map((batch) => (
        <><div key={batch._id} className="px-4 py-2">
          <b>Batch ID:</b> {batch._id}
        </div><div className="px-4 py-2">
            <b>Filled Date:</b> {batch.filledDate}
          </div><div className="px-4 py-2">
            <b>Barcode:</b> {batch.barcode}
          </div></>
        ))}
        */}
        
        {confirmFillWindow && (
          <div className="text-red-500">
            Click again to confirm perscription fill.
          </div>
        )}
        {itemExpired && (
          <div className="text-red-500 font-bold">
            Cannot fill, medication has issues
          </div>
        )}

        {itemNotAvailable && (
          <div className="text-red-500 font-bold">
            Not enough stock is available
          </div>
        )}
        {itemAvailable && (
          <div className="text-green-500 font-bold">
            Stock is available
          </div>
        )}

        <button
          className="bottom-0 right-0 m-2 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleCheck}
        >
          Check Availability
        </button>
        <button
          className="bottom-0 right-0 m-2 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleFillItem}
        >
          Fill Prescription
        </button>
      </div>
    </div>
  );
}
