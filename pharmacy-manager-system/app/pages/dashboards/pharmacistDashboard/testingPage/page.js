"use client";
import { useEffect, useState } from "react";
import PopUpTest from "./PopUpTest"
import "../../../../globals.css"
export default function Inventory() {
    const inputStyle =
      "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline";
    const labelStyle = "block text-white text-sm font-bold mb-2";

  const [inventoryItems,     setInventoryItems] = useState([]);
  const [popupWindow,        setPopupWindow]        = useState(false); 
  const [popupWindowContent, setPopupWindowContent] = useState({}); 


  const initialState = {
    medicationName: ""
  }
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleCheckSubmit = async (e) => {
    const token = localStorage.getItem("token"); // get auth token from localStorage

    fetch("http://127.0.0.1:3030/pharmacy-0x2/api/inventory/get-item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // include bearer token in the Autho header
      },
      body: JSON.stringify({
        medicationName: formData.medicationName
    })
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Network response error');
      }
      return res.json();
    })
    .then((data) => {
      setInventoryItems(data); 
      console.log(data); 
    }) 
    .catch((error) => {
      console.error('Fetch error:', error);
    }); 
    e.preventDefault(); 

    setPopupWindow(true); 
    inventoryItems.map((item) =>{
    setPopupWindowContent({
      name: item.name,
      _id: item._id, 
      description: item.description, 
      category: item.category, 
      price: item.price,
      quantityInStock: item.quantityInStock,
      manufacturer: item.manufacturer,
      barcode: item.barcode, 
      expirationDate: item.expirationDate,
      location: item.location,
      created_at: item.created_at,
      updated_at: item.updated_at 
    })})
  };

  const blockStyle = "m-5 p-5 flex flex-col justify-center items-center ";
  return (
    <div className={blockStyle}>
      <h3>CheckItem </h3>
      <form
          onSubmit={handleCheckSubmit}
          className="max-w-[800px] w-full mx-auto bg-transparent p-4 rounded border border-blue-500"
        >
        <input type="submit" style={{display: false}}/>
          <hr className="mb-2" />
          <div className="w-full  md:flex flex-1">
            <div className="w-full mx-2">
              <label className={labelStyle}>Medication Name</label>
              <input
                type="text"
                placeholder="Medication Name"
                className={inputStyle}
                id="medicationName"
                name="medicationName"
                value={formData.medicationName}
                onChange={handleChange}
                required
              />
            </div>
            </div>
            </form>
      {popupWindow && <PopUpTest
                        popupWindowContent={popupWindowContent} 
                        setPopupWindow={setPopupWindow}/>
      }
    </div>
  );
}