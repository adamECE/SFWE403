'use client'
import React, { useState } from "react";

export default function PopupNotificationWindow({
  popupWindowContent,
  setPopupWindow,
  notificationsUpdated,
  setNotificationsUpdated,
  setOrderPopupWindowContent,
  setShowOrderForm,
}) {
  const [confirmDeleteWindow, setConfirmDeleteWindow] = useState(false);
  const [itemNotExpired, setItemNotExpired] = useState(false);
  const [orderQuantityOption, setOrderQuantityOption] = useState(false); 
  const [sucessfulSubmit, setSucessfulSubmit] = useState('');

  const handleCloseModalBtn = (e) => {
    e.preventDefault();
    setPopupWindow(false);
    // Make sure everything else is closed
    setItemNotExpired(false);
    setConfirmDeleteWindow(false);
    setWarningText('');
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Get auth token from localStorage
    await fetch("http://127.0.0.1:3030/pharmacy-0x2/api/inventory/get-item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify the content type as JSON
          Authorization: `Bearer ${token}`, // Include bearer token in the Autho header
        },
        body: JSON.stringify({
          medicationID: popupWindowContent.medID,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response error");
          }
            return res.json();
          })
        .then((data) => {
          console.log(data)
          setOrderPopupWindowContent({
            medicationID: data[0].barcode,
            name: data[0].name,
            category: data[0].category,
            description: data[0].description,
            price: data[0].price,
            quantityInStock: data[0].quantityInStock,
            manufacturer: data[0].manufacturer,
            location: data[0].location,
            created_at: data[0].created_at,
            updated_at: data[0].updated_at,
          });
      
          setShowOrderForm(true);
        })
        .catch((error) => {
          console.error("Delete error:", error);
        });
};
  const handleDeleteItem = async (e) => {
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
          medicationID: popupWindowContent.medID,
          barcode: popupWindowContent.batchID,
        }),
      })
        .then((res) => {
          if (res.status === 401) {
            // Let the user know the item is not expired
            setItemNotExpired(true);
            setConfirmDeleteWindow(false);
          } else {
            setNotificationsUpdated(!notificationsUpdated);
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
        <h3 className="text-black">{popupWindowContent.medName}</h3>
        <div className="font-bold">Message:</div>
        <div className="border-2 px-4 py-2">
          {popupWindowContent.message}
        </div>
        <div className="px-4 py-2">
          <b>Medication ID:</b> {popupWindowContent.medID}
        </div>
        {(popupWindowContent.notiType === "quantLow") && ( 
        <div className="px-4 py-2">
          <b>Total Quantity in Stock:</b> {popupWindowContent.totalQuant}
        </div>
        )}
        <div className="px-4 py-2">
          <b>Notification Type:</b> {popupWindowContent.notiType}
        </div>
        {(popupWindowContent.notiType === "expSoon") && (
        <div className="px-4 py-2">
          <b>batchID:</b> {popupWindowContent.batchID}
        </div>
        )}
        {(popupWindowContent.notiType === "expSoon") && (
        <div className="px-4 py-2">
          <b>ExpirationDate:</b> {popupWindowContent.expirationDate}
        </div>
        )}
        <div className="px-4 py-2">
          <b>Created At:</b> {popupWindowContent.created_at}
        </div>
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
        {(popupWindowContent.notiType === "expSoon") && (
        <button
          className="bottom-0 right-0 m-2 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleDeleteItem}
        >
          Delete Item
        </button>
        )}
        {(sucessfulSubmit.length != 0) && <div className="text-blue-500">
                {sucessfulSubmit} 
            </div>}
            {(popupWindowContent.notiType === "quantLow") && !orderQuantityOption && 
            <button className="bottom-0 right-0 m-2 px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={handlePlaceOrder}>
                Order New Batch
            </button>}
          
      </div>
    </div>
  );
}
