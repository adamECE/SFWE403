'use client'
import React, { useState } from "react";

export default function PopupPrescriptionItemWindow({
  popupWindowContent,
  setPopupWindow,
  prescriptionUpdated,
  setPrescriptionUpdated,
}) {
  const [confirmDeleteWindow, setConfirmDeleteWindow] = useState(false);
  const [itemNotExpired, setItemNotExpired] = useState(false);

  const handleCloseModalBtn = (e) => {
    e.preventDefault();
    setPopupWindow(false);
    // Make sure everything else is closed
    setItemNotExpired(false);
    setConfirmDeleteWindow(false);
  };

  const handleFillItem = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // Get auth token from localStorage

    if (!confirmDeleteWindow) {
      setConfirmDeleteWindow(true);
    } else {
      // Delete item from prescription after user confirms deletion
      await fetch("http://127.0.0.1:3030/pharmacy-0x2/api/inventory/remove-item", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json", // Specify the content type as JSON
          Authorization: `Bearer ${token}`, // Include bearer token in the Autho header
        },
        body: JSON.stringify({
          medicationID: popupWindowContent._id,
        }),
      })
        .then((res) => {
          if (res.status === 401) {
            // Let the user know the item is not expired
            setItemNotExpired(true);
            setConfirmDeleteWindow(false);
          } else {
            setPrescriptionUpdated(!prescriptionUpdated);
            setPopupWindow(false);
          }
        })
        .catch((error) => {
          console.error("Delete error:", error);
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
          <b>Medication ID:</b> ${popupWindowContent.medicationID}
        </div>
        <div className="px-4 py-2">
          <b>Price:</b> ${popupWindowContent.price}
        </div>
        <div className="px-4 py-2">
          <b>Quantity:</b> {popupWindowContent.quantity}
        </div>
        <div className="px-4 py-2">
          <b>Manufacturer:</b> {popupWindowContent.manufacturer}
        </div>
        <div className="px-4 py-2">
          <b>Created At:</b> {popupWindowContent.created_at}
        </div>
        <div className="px-4 py-2">
          <b>Updated At:</b> {popupWindowContent.updated_at}
        </div>
        {/* Render batch information */}
      {popupWindowContent.batches.map((batch) => (
        <><div key={batch._id} className="px-4 py-2">
          <b>Batch ID:</b> {batch._id}
        </div><div className="px-4 py-2">
            <b>Filled Date:</b> {batch.filledDate}
          </div><div className="px-4 py-2">
            <b>Barcode:</b> {batch.barcode}
          </div></>
        ))}
        
        {confirmDeleteWindow && (
          <div className="text-red-500">
            Click again to confirm item deletion.
          </div>
        )}
        {itemNotExpired && (
          <div className="text-red-500 font-bold">
            Cannot delete, item is not expired.
          </div>
        )}
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
