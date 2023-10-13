"use client";
import React, { useState } from "react";

export default function PopupPrescriptionItemWindow({
  popupWindowContent,
  setPopupWindow,
  prescriptionUpdated,
  setPrescriptionUpdated,
}) {
  const inputStyle =
    "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline";

  const [confirmFillWindow, setConfirmFillWindow] = useState(false);
  const [itemExpired, setItemExpired] = useState(false);
  const [itemNotAvailable, setItemNotAvailable] = useState(false);
  const [itemAvailable, setItemAvailable] = useState(false);
  const [item, setItem] = useState({});

  const initialState = {
    barcode: "",
  };
  const [formData, setFormData] = useState(initialState);

  const handleCloseModalBtn = (e) => {
    e.preventDefault();
    setPopupWindow(false);
    // Make sure everything else is closed
    setItemExpired(false);
    setConfirmFillWindow(false);
    setItemNotAvailable(false);
    setItemAvailable(false);
  };
  const handleFCheck = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    await fetch(`http://127.0.0.1:3030/pharmacy-0x2/api/inventory/get-item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        medicationID: popupWindowContent.medicationID,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          alert(response.statusText);
          throw new Error("Network response error");
        }
        return response.json();
      })
      .then((data) => {
        setItem(data[0]);
        console.log(item);
      })
      .then((response) => {
        if (item.quantity <= popupWindowContent.quantity) {
          setItemNotAvailable(true);
        } else {
          setItemAvailable(true);
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleFillItem = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // Get auth token from localStorage

    if (!confirmFillWindow) {
      setConfirmFillWindow(true);
    } else {
      const response = await fetch(
        "http://127.0.0.1:3030/pharmacy-0x2/api/patientHistory/fill-prescription",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json", // Specify the content type as JSON
            Authorization: `Bearer ${token}`, // Include bearer token in the Autho header
          },
          body: JSON.stringify({
            userID: popupWindowContent.patient._id,
            medicationID: popupWindowContent.medicationID,
            barcode: formData.barcode,
            prescriptionID: popupWindowContent._id,
          }),
        }
      );
      if (response.ok) {
        setFormData(initialState);
        const responseText = await response.text();
        alert(JSON.parse(responseText).message);
      } else {
        setFormData(initialState);
        const errorText = await response.text();
        alert(JSON.parse(errorText).error);
      }

      // .then((res) => {
      //   console.log(res);
      //   if (res.status === 401 || res.status === 404) {
      //     alert(res.text);
      //     // Let the user know the item is not expired
      //     setItemExpired(true);
      //     setConfirmFillWindow(false);
      //   } else {
      //     alert(res.statusText);
      //     setPrescriptionUpdated(!prescriptionUpdated);
      //     setPopupWindow(false);
      //   }
      // })
      // .catch((error) => {
      //   console.error("Fill error:", error);
      // });
    }
  };

  return (
    <>
      <div
        id="myModal"
        className="modal p-10px fixed w-full h-full top-0 left-0 flex items-center justify-center"
      >
        <div className="modal-content border-2 border-gray-800 border-opacity-100 bg-white p-8 rounded shadow-lg relative">
          <button
            className="top-0 right-0 m-2 px-4 py-2 bg-blue-500 text-white rounded absolute"
            onClick={handleCloseModalBtn}
          >
            & times;{" "}
          </button>{" "}
          <h3 className="text-black"> {popupWindowContent.name} </h3>{" "}
          <div className="font-bold"> Description: </div>{" "}
          <div className="border-2 px-4 py-2">
            {" "}
            {popupWindowContent.description}{" "}
          </div>{" "}
          <div className="px-4 py-2">
            <b> Delivered By: </b> {popupWindowContent.deliveredBy}{" "}
          </div>{" "}
          <div className="px-4 py-2">
            <b> Doctor Name: </b> {popupWindowContent.doctorName}{" "}
          </div>{" "}
          <div className="px-4 py-2">
            <b> Dosage: </b> {popupWindowContent.dosage}{" "}
          </div>{" "}
          <div className="px-4 py-2">
            <b> Quantity: </b> {popupWindowContent.quantity}{" "}
          </div>{" "}
          <div className="px-4 py-2">
            <b> Medication ID: </b> {popupWindowContent.medicationID}{" "}
          </div>{" "}
          <div className="px-4 py-2">
            <b> Medication Name: </b> {popupWindowContent.medicationName}{" "}
          </div>{" "}
          <div className="px-4 py-2">
            <b> Refills: </b> {popupWindowContent.refills}{" "}
          </div>{" "}
          {confirmFillWindow && (
            <div className="text-red-500">
              Click again to confirm perscription fill.{" "}
            </div>
          )}{" "}
          {itemExpired && (
            <div className="text-red-500 font-bold">
              Cannot fill, medication has issues{" "}
            </div>
          )}{" "}
          {itemNotAvailable && (
            <div className="text-red-500 font-bold">
              Not enough stock is available{" "}
            </div>
          )}{" "}
          {itemAvailable && (
            <div className="text-green-500 font-bold"> Stock is available </div>
          )}{" "}
          <form onSubmit={handleFCheck}>
            <button
              className="bottom-0 right-0 m-2 px-4 py-2 bg-blue-500 text-white rounded"
              type="submit"
            >
              Check Availability
            </button>{" "}
          </form>
          <form onSubmit={handleFillItem}>
            {/* Render batch information */}
            {itemAvailable && (
              <select
                className={inputStyle}
                id="barcode"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                required
              >
                <option value=""> -- select an option -- </option>

                {itemAvailable &&
                  item.batches.map((batch) => (
                    <option key={batch.barcode} value={item.barcode}>
                      {batch.barcode}
                    </option>
                  ))}
              </select>
            )}{" "}
            <button className="bottom-0 right-0 m-2 px-4 py-2 bg-blue-500 text-white rounded">
              Fill Prescription{" "}
            </button>{" "}
          </form>
        </div>{" "}
      </div>
    </>
  );
}
