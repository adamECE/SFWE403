"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2'
export default function PopupOrdersItemWindow({
  popupWindowContent,
  setPopupWindow,
}) {
  const inputStyle =
    "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline";
  const submitButtonStyle =
    "bgCor  border rounded w-full py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline";
  const labelSyle = "block text-black text-sm font-bold mb-2";
  const router = useRouter();
  const handleCloseModalBtn = (e) => {
    e.preventDefault();
    setPopupWindow(false);
  };

  const initialState = {
    expirationDate: "",
  };
  const [formData, setFormData] = useState(initialState);
  const [orderStatus, setOrderStatus] = useState(popupWindowContent.status);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAcceptOrder = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://127.0.0.1:3030/pharmacy-0x2/api/inventory/update-order",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // Include the bearer token in the Authorization header
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            orderID: popupWindowContent.orderID,
            status: "received",
            expirationDate: formData.expirationDate,
          }),
        }
      );

      if (response.ok) {
        setFormData(initialState);
        const responseText = await response.text();
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: JSON.parse(responseText).message,
          showConfirmButton: false,
          timer: 1500
})
        //alert(JSON.parse(responseText).message);

        setOrderStatus("received");
        setPopupWindow(false);
      } else {
        setFormData(initialState);
        const errorText = await response.text();
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.parse(errorText).error,

                    })
        //alert(JSON.parse(errorText).error);
      }
    } catch (error) {
      console.error("error:", error);
    }
  };

  return (
    <div
      id="myModal"
      className="modal p-10px fixed w-full h-full top-0 left-0 flex items-center justify-center"
    >
      <div className="modal-content border-2 border-blue-300 border-opacity-100 bg-white p-4 rounded shadow-lg relative">
        <div className="px-4 py-2 p-8 ">
          <button
            className="top-0 right-0 m-1 px-2 py-1 bgCor text-white rounded absolute"
            onClick={handleCloseModalBtn}
          >
            &times;{" "}
          </button>{" "}
          <b> Order Details for: </b> {popupWindowContent.medicationName}{" "}
        </div>{" "}
        <hr className="px-4 py-2 " />
        <div className="px-4 py-2">
          <b> Quantity: </b> {popupWindowContent.quantity}{" "}
        </div>{" "}
        <div className="px-4 py-2">
          <b> Supplier: </b> {popupWindowContent.supplier}{" "}
        </div>{" "}
        <div className="px-4 py-2">
          <b> Order Date: </b> {popupWindowContent.orderDate}{" "}
        </div>{" "}
        <div className="px-4 py-2">
          <b> Reception Date: </b> {popupWindowContent.receptionDate}{" "}
        </div>{" "}
        <div className="px-4 py-2">
          <b> Status: </b> {popupWindowContent.status}{" "}
        </div>{" "}
        {orderStatus == "received" ? (
          ""
        ) : (
          <>
            <hr />
            <form onSubmit={handleAcceptOrder}>
              <label className={labelSyle}> Expiration Date </label>{" "}
              <input
                type="date"
                className={inputStyle}
                required={true}
                name="expirationDate"
                id="expirationDate"
                value={formData.expirationDate}
                onChange={handleChange}
              />{" "}
              <button className={submitButtonStyle} type="submit">
                Accept Order{" "}
              </button>{" "}
            </form>{" "}
          </>
        )}{" "}
      </div>{" "}
    </div>
  );
}
