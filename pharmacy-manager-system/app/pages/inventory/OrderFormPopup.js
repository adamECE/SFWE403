"use client";
import { useState } from "react";
import Swal from 'sweetalert2'
export default function OrderFormPopup({
  setSecondPopup,
  orderPopupWindowContent,
}) {
  const initialState = {
    quantity: "",
    supplier: "",
  };
  const [formData, setFormData] = useState({ initialState });

  const inputStyle =
    "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline";
  const submitButtonStyle =
    "bgCor  border rounded w-full py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline";
  const labelSyle = "block text-black text-sm font-bold mb-2";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Call the submitOrder function with formData
    //alert(orderPopupWindowContent.medicationID);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://127.0.0.1:3030/pharmacy-0x2/api/inventory/place-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Include the bearer token in the Authorization header
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            medicationID: orderPopupWindowContent.medicationID,
            quantity: Number(formData.quantity),
            supplier: formData.supplier,
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
          showConfirmButton: true
         
})
        //alert(JSON.parse(responseText).message);
        router.refresh();
      } else {
        setFormData(initialState);
        const errorText = await response.text();
        alert(JSON.parse(errorText).error);
      }
    } catch (error) {
      console.error("error:", error);
    }
  };
  const handleCloseModalBtn = (e) => {
    e.preventDefault();
    setSecondPopup(false);
  };

  return (
    <div
      id="myModal"
      className="modal p-10px fixed w-screen h-full top-0 left-0 flex items-center justify-center custom-z-pos-index"
    >
      <div className="modal-content border-2 border-blue-800 border-opacity-100 bg-white p-8 rounded shadow-lg relative">
        <button
          className="top-0 right-0 m-1 px-2 py-1 bg-blue-500 text-white rounded absolute"
          onClick={handleCloseModalBtn}
        >
          &times;{" "}
        </button>{" "}
        <div className="order-form-popup">
          <form onSubmit={handleSubmit}>
            <h3 className="text-black my-3">
              {` New Order for:  ${orderPopupWindowContent.name}`}{" "}
            </h3>{" "}
            <div className="font-bold">Description:</div>{" "}
            <div className="border-2 px-4 py-2 ">
              {" "}
              {orderPopupWindowContent.description}{" "}
            </div>{" "}
            <div className="w-full  md:flex flex-1">
              <div className="w-full mx-2">
                <div className="px-4 py-2">
                  <b> Category: </b> {orderPopupWindowContent.category}{" "}
                </div>{" "}
              </div>
              <div className="w-full mx-2 px-4 py-2">
                <b> Price: </b> ${orderPopupWindowContent.price}{" "}
              </div>{" "}
            </div>
            <div className="w-full  md:flex flex-1">
              <div className="px-4 py-2 w-full mx-2">
                <b> Manufacturer: </b> {orderPopupWindowContent.manufacturer}{" "}
              </div>{" "}
              <div className="px-4 py-2 w-full mx-2">
                <b> Location: </b> {orderPopupWindowContent.location}{" "}
              </div>{" "}
            </div>
            <hr />
            <p className="text-black my-3 bg-blue-100">Order Details</p>
            <hr />
            <div className="w-full  md:flex flex-1">
              <div className=" w-full mx-2">
                <label className={labelSyle}>Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  className={inputStyle}
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="quantity"
                  required={true}
                  min="1"
                />{" "}
              </div>
              <div className=" w-full mx-2">
                <label className={labelSyle}>Supplier</label>
                <input
                  type="text"
                  name="supplier"
                  className={inputStyle}
                  value={formData.supplier}
                  onChange={handleChange}
                  placeholder="supplier"
                  required={true}
                />{" "}
              </div>
            </div>
            {/* Add more form fields as needed */}{" "}
            <button className={submitButtonStyle} type="submit">
              {" "}
              Place Order{" "}
            </button>{" "}
          </form>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
