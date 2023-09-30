"use client";
import { useEffect, useState } from "react";
import InventoryRow from "./InventoryRow";

export default function Inventory() {
  // not sure how I'm actually gonna store this stuff
  const [inventoryItems,     setInventoryItems] = useState([]);
  const [popupWindow,        setPopupWindow]        = useState(false); 
  const [popupWindowContent, setPopupWindowContent] = useState({}); 

  // Sample inventory data (to be replace with actual data from API)
  const sampleInventoryData = [
    {
      id: 1,
      name: "Item 1",
      category: "Category 1",
      description: "This is a sample desc words words words words words words words words words words words words",
      price: 10.0,
      quantityInStock: 20,
      manufacturer: "Manufacturer 1",
      barcode: "12345",
      expirationDate: "2023-12-31",
      location: "Location 1",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 2,
      name: "Item 2",
      category: "Category 2",
      description: "This is a sample desc",
      price: 15.0,
      quantityInStock: 15,
      manufacturer: "Manufacturer 2",
      barcode: "12345",
      expirationDate: "2024-06-30",
      location: "Location 2",
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  useEffect(() => {
    fetch('http://127.0.0.1:3030/pharmacy-0x2/api/inventory/')
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
      setInventoryItems(sampleInventoryData);
    });
    
  }, []);

  const handleCloseModalBtn = (e) => {
    e.preventDefault(); 
    setPopupWindow(false); 
  } 

  const thStyle = " px-6 py-4";
  const blockStyle = "m-5  p-5 flex flex-col justify-center items-center ";
  return (
    <div className={blockStyle}>
      <h3>Current Inventory </h3>

      {/* Only show modal if an item is clicked */}
      {popupWindow && 
      <div id="myModal" class="modal p-10px fixed w-full h-full top-0 left-0 flex items-center justify-center">
        <div class="modal-content border-2 border-gray-800 border-opacity-100 bg-white p-8 rounded shadow-lg relative">
            <button class="top-0 right-0 m-2 px-4 py-2 bg-blue-500 text-white rounded absolute"
                    onClick={handleCloseModalBtn}>
              &times;
            </button>
            <h3 className="text-black">
              {popupWindowContent.name}
            </h3>
            <div className="font-bold">
               Description: 
            </div>
            <div className="border-2 px-4 py-2">
                {popupWindowContent.description}
            </div>
            <div className="px-4 py-2">
               <b>Category:</b> {popupWindowContent.category} 
            </div>
            <div className="px-4 py-2">
               <b>Price:</b> ${popupWindowContent.price} 
            </div>
            <div className="px-4 py-2">
               <b>Quantity:</b> {popupWindowContent.quantityInStock} 
            </div>
            <div className="px-4 py-2">
               <b>Manufacturer:</b> {popupWindowContent.manufacturer} 
            </div>
            <div className="px-4 py-2">
               <b>Expiration Date:</b> {popupWindowContent.expirationDate} 
            </div>
            <div className="px-4 py-2">
               <b>Barcode:</b> {popupWindowContent.barcode} 
            </div>
            <div className="px-4 py-2">
               <b>Location:</b> {popupWindowContent.location} 
            </div>
            <div className="px-4 py-2">
               <b>Created At:</b> {popupWindowContent.created_at.toDateString()} 
            </div>
            <div className="px-4 py-2">
               <b>Updated At:</b> {popupWindowContent.updated_at.toDateString()} 
            </div>
        </div>
      </div>
      }

      <table className="border-collapse border border-sky-700 md:table-fixed  font-light mx-4 my-4">
        <thead className="border-b bg-neutral-50 font-medium dark:border-neutral-500 dark:text-neutral-800">
          <tr>
            <th scope="col" className={thStyle}>
              Name
            </th>
            <th scope="col" className={thStyle}>
              Category
            </th>
            <th scope="col" className={thStyle}>
              Price
            </th>
            <th scope="col" className={thStyle}>
              Quantity
            </th>
            <th scope="col" className={thStyle}>
              Manufacturer
            </th>
            <th scope="col" className={thStyle}>
              Expiration Date
            </th>
            <th scope="col" className={thStyle}>
              Location
            </th>
          </tr>
        </thead>
        <tbody>
          {inventoryItems.map((item) => (
            <InventoryRow
              key={item.id}
              popupWindow={popupWindow}
              setPopupWindow={setPopupWindow}
              setPopupWindowContent={setPopupWindowContent}
              name={item.name}
              category={item.category}
              description={item.description}
              barcode={item.barcode}
              price={item.price}
              quantityInStock={item.quantityInStock}
              manufacturer={item.manufacturer}
              expirationDate={item.expirationDate}
              location={item.location}
              created_at={item.created_at}
              updated_at={item.updated_at}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
