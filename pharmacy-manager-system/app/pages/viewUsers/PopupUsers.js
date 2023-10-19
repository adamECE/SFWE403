"use client";
import React, { useState, useEffect} from "react";

export default function PopupUsers({
    popupWindowContent,
    setPopupWindow,
    usersUpdated,
    setUsersUpdated,
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

  const handleUnlockAccount = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // Get auth token from localStorage

    if (!confirmDeleteWindow) {
      setConfirmDeleteWindow(true);
    } else {
      // Delete item from prescription after user confirms deletion
      await fetch("http://127.0.0.1:3030/pharmacy-0x2/api/unlock-account", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // Specify the content type as JSON
          Authorization: `Bearer ${token}`, // Include bearer token in the Autho header
        },
        body: 
        JSON.stringify({
          "email": "japinto.ja@gmail.com"
        })
        
      })
        .then((res) => {
          if (res.status === 401) {
            // Let the user know the item is not expired
            //setItemNotExpired(true);
            setConfirmDeleteWindow(false);
          } else {
            setUsersUpdated(!usersUpdated);
            setPopupWindow(false);
            console.log("Here");
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
        <div className="font-bold"> User:</div>
        <div className="border-2 px-4 py-2">
          {popupWindowContent.firstName} {popupWindowContent.lastName}
        </div>
        <div className="px-4 py-2">
          <b>Email:</b> {popupWindowContent.email}
        </div>
        <div className="px-4 py-2">
          <b>Phone Number:</b> {popupWindowContent.phoneNumber}
        </div>
        <div className="px-4 py-2">
          <b>Role:</b> {popupWindowContent.role}
        </div>
        <div className="px-4 py-2">
          <b>DOB:</b> {popupWindowContent.dateOfBirth}
        </div>
        <div className="px-4 py-2">
        <b>Address:</b> {popupWindowContent.addressStreet} {popupWindowContent.addressCity}, {popupWindowContent.addressState} {popupWindowContent.addressZipcode}
        </div>
        <div className="px-4 py-2">
          <b>Last Login:</b> {popupWindowContent.lastLogin}
        </div>
        

        
        
        
        
        {popupWindowContent.isLocked && (
            <button
                className="bottom-0 right-0 m-2 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleUnlockAccount}
                >
                Unlock Account
            </button>
        )}
      </div>
    </div>
  );
}