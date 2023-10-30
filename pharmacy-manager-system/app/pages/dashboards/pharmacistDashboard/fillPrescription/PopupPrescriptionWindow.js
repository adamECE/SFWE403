"use client";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
export default function PopupPrescriptionItemWindow({
  popupWindowContent,
  setPopupWindow,
  setItem,
  item,
}) {
  const [confirmFillWindow, setConfirmFillWindow] = useState(false);
  const [itemExpired, setItemExpired] = useState(false);
  const [itemNotAvailable, setItemNotAvailable] = useState(false);
  const [itemAvailable, setItemAvailable] = useState(false);
  const [showBatchInfo, setShowBatchInfo] = useState(false);
  const [batchInfo, setBatchInfo] = useState({
    quantity: "",
    expDate: "",
  });
  const inputStyle =
    "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline";
  const labelSyle = "block text-black text-sm font-bold mb-2";
  let itemT = {};
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
    setItem({});
  };
  const handleFCheck = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:3030/pharmacy-0x2/api/inventory/get-item`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            medicationID: popupWindowContent.medicationID,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setItem(data[0]);
      } else {
        const errorText = await response.text();
        Swal.fire(`${JSON.parse(errorText).error}`, "", "error");
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (Object.keys(item).length != 0) {
      if (item.quantityInStock <= popupWindowContent.quantity) {
        setItemAvailable(false);
        setItemNotAvailable(true);
      } else {
        setItemNotAvailable(false);
        setItemAvailable(true);
      }
    }
  }, [item]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    const bt = item.batches.find(function (prs) {
      return prs.barcode == e.target.value;
    });
    setBatchInfo({
      quantity: bt.quantity,
      expDate: new Date(bt.expirationDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
    });
    setShowBatchInfo(true);
  };

  const handleFillItem = async (e) => {
    e.preventDefault();
    try {
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
          // alert(JSON.parse(responseText).message);
          Swal.fire(`${JSON.parse(responseText).message}`, "", "success");
          setConfirmFillWindow(false);
        } else {
          setFormData(initialState);
          setConfirmFillWindow(false);
          const errorText = await response.text();
          //alert(JSON.parse(errorText).error);
          Swal.fire(`${JSON.parse(errorText).error}`, "", "error");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div
        id="myModal"
        className="modal p-10px fixed w-full h-full top-0 left-0 flex items-center justify-center overflow-auto"
      >
        <div className="modal-content border-2 border-gray-800 border-opacity-100 bg-white p-8 rounded shadow-lg relative overflow-y-auto">
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
          <div className="flex">
            <div className="px-4 py-2 flex-1">
              <b> Medication ID: </b> {popupWindowContent.medicationID}{" "}
            </div>{" "}
            <div className="px-2 py-2 flex-1">
              <b> Due on: </b>{" "}
              {new Date(popupWindowContent.refillDueDate).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                }
              )}{" "}
            </div>{" "}
          </div>{" "}
          <div className="flex">
            <div className="px-4 py-2 flex-1">
              <b> Delivered By: </b> {popupWindowContent.deliveredBy}{" "}
            </div>{" "}
            <div className="px-4 py-2 flex-1">
              <b> Doctor Name: </b> {popupWindowContent.doctorName}{" "}
            </div>{" "}
          </div>{" "}
          <div className="flex">
            <div className="px-4 py-2">
              <b> Dosage: </b> {popupWindowContent.dosage}{" "}
            </div>{" "}
            <div className="px-4 py-2">
              <b> Quantity: </b> {popupWindowContent.quantity}{" "}
            </div>{" "}
          </div>{" "}
          <div className="flex">
            <div className="px-2 py-2 flex-1">
              <b> #Refills Left: </b> {popupWindowContent.refills}{" "}
            </div>{" "}
            <div className="px-2 py-2 flex-1">
              <b> #Times Filled: </b> {popupWindowContent.filledInfo.length}{" "}
            </div>{" "}
            <div className="px-2 py-2 flex-1">
              <b> Last Filled on: </b>{" "}
              {popupWindowContent.filledInfo.length > 0
                ? new Date(
                    popupWindowContent.filledInfo[
                      popupWindowContent.filledInfo.length - 1
                    ].filledDate
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                : "--"}{" "}
            </div>{" "}
          </div>{" "}
          {itemExpired && (
            <div className="text-red-500 font-bold">
              Cannot fill, medication has issues{" "}
            </div>
          )}{" "}
          <div className="flex">
            <div className="flex-1">
              <form onSubmit={handleFCheck}>
                <button
                  className="bottom-0 right-0 m-2 px-4 py-2 bg-blue-500 text-white rounded"
                  type="submit"
                >
                  Check Availability{" "}
                </button>{" "}
              </form>{" "}
            </div>
            <div className="flex-1">
              {" "}
              {itemNotAvailable && (
                <button
                  type="button"
                  className="text-white rounded bg-red-500 font-bold bottom-0 right-0 m-2 px-2 py-2"
                >
                  Not enough stock is available{" "}
                </button>
              )}{" "}
              {itemAvailable && (
                <button
                  type="button"
                  className="text-white rounded bg-green-500 font-bold bottom-0 right-0 m-2 px-2 py-2"
                >
                  Stock is available{" "}
                </button>
              )}{" "}
            </div>{" "}
          </div>{" "}
          <hr className="px-4 py-2 text-black" />{" "}
          {itemAvailable && (
            <>
              <form onSubmit={handleFillItem}>
                <>
                  {" "}
                  {showBatchInfo && (
                    <>
                      <div className="bgCor flex">
                        <p className=" py-2 text-black">
                          <b> Selected Batch Info: </b>{" "}
                        </p>{" "}
                        <hr className=" text-black" />
                        <p className="flex-1">
                          Available Quantity: {batchInfo.quantity}{" "}
                        </p>{" "}
                        <p className="flex-1">
                          Expiration Date: {batchInfo.expDate}{" "}
                        </p>{" "}
                      </div>{" "}
                    </>
                  )}{" "}
                  <hr className="bg-black" />
                  <label className={labelSyle}> Batch Barcode </label>{" "}
                  <select
                    className={inputStyle}
                    id="barcode"
                    name="barcode"
                    value={formData.barcode}
                    onChange={handleChange}
                    required
                  >
                    <option value=""> --select a Batch-- </option>{" "}
                    {itemAvailable &&
                      item.batches.map((batch) => (
                        <option key={batch.barcode} value={item.barcode}>
                          {" "}
                          {batch.barcode}{" "}
                        </option>
                      ))}{" "}
                  </select>{" "}
                  {confirmFillWindow && (
                    <div className="text-red-500">
                      Click again to confirm perscription fill.{" "}
                    </div>
                  )}{" "}
                  <button
                    type="submit"
                    className="bottom-0 right-0 m-2 px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Fill Prescription{" "}
                  </button>{" "}
                </>{" "}
              </form>{" "}
            </>
          )}{" "}
        </div>{" "}
      </div>{" "}
    </>
  );
}
