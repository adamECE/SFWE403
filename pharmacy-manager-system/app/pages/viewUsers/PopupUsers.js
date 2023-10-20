"use client";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
export default function PopupUsers({
  popupWindowContent,
  setPopupWindow,
  usersUpdated,
  setUsersUpdated,
}) {
  const handleCloseModalBtn = (e) => {
    e.preventDefault();
    setPopupWindow(false);
    // Make sure everything else is closed
  };

  const handleUnlockAccount = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: " Are you sure you want unlock this account?",
      showDenyButton: true,
      confirmButtonText: "YES",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");

          const response = await fetch(
            "http://127.0.0.1:3030/pharmacy-0x2/api/unlock-account",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },

              body: JSON.stringify({
                email: popupWindowContent.email,
              }),
            }
          );
          if (response.ok) {
            const responseText = await response.text();
            setUsersUpdated(!usersUpdated);
            setPopupWindow(false);
            Swal.fire(`${JSON.parse(responseText).message}`, "", "success");
          } else {
            const errorText = await response.text();
            Swal.fire(`${JSON.parse(errorText).error}`, "", "error");
          }
        } catch (error) {
          console.error("error:", error);
        }
      } else if (result.isDenied) {
      }
    });
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
          &times;{" "}
        </button>{" "}
        <h3 className="text-black"> {popupWindowContent.name} </h3>{" "}
        <div className="font-bold"> User: </div>{" "}
        <div className="border-2 px-4 py-2">
          {" "}
          {popupWindowContent.firstName} {popupWindowContent.lastName}{" "}
        </div>{" "}
        <div className="px-4 py-2">
          <b> Email: </b> {popupWindowContent.email}{" "}
        </div>{" "}
        <div className="px-4 py-2">
          <b> Phone Number: </b> {popupWindowContent.phoneNumber}{" "}
        </div>{" "}
        <div className="px-4 py-2">
          <b> Role: </b> {popupWindowContent.role}{" "}
        </div>{" "}
        <div className="px-4 py-2">
          <b> DOB: </b> {popupWindowContent.dateOfBirth}{" "}
        </div>{" "}
        <div className="px-4 py-2">
          <b> Address: </b> {popupWindowContent.addressStreet}{" "}
          {popupWindowContent.addressCity}, {popupWindowContent.addressState}{" "}
          {popupWindowContent.addressZipcode}{" "}
        </div>{" "}
        <div className="px-4 py-2">
          <b> Last Login: </b> {popupWindowContent.lastLogin}{" "}
        </div>{" "}
        {popupWindowContent.isLocked && (
          <button
            className="bottom-0 right-0 m-2 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleUnlockAccount}
          >
            Unlock Account{" "}
          </button>
        )}{" "}
      </div>{" "}
    </div>
  );
}
