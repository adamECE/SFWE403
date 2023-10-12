"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import React from 'react';
import InventoryRow from "./InventoryRow";
import PopupInvenotryItemWindow from "./PopupInventoryItemWindow"
import BatchItem from "./BatchItem";

export default function Inventory() {
  const [inventoryItems,     setInventoryItems]     = useState([]);
  const [popupWindow,        setPopupWindow]        = useState(false); 
  const [popupWindowContent, setPopupWindowContent] = useState({}); 
  const [inventoryUpdated,   setInventoryUpdated]   = useState(false);
  const [storedBatches,      setStoredBatches]      = useState(new Map()); 
 
  const router = useRouter();

  useEffect(() => {
    setInventoryUpdated(!inventoryUpdated); 
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("token"); // get auth token from localStorage
    //setInventoryItems([inventoryData]) //for testing 
    fetch("http://127.0.0.1:3030/pharmacy-0x2/api/inventory/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // include bearer token in the Autho header
      },
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Network response error');
      }
      return res.json();
    })
    .then((data) => {

      const tempMap = new Map(storedBatches);

      for (const item of data) {
        for (const batch of item.batches) {
          tempMap.set(batch.barcode, item);
          batch.parentId = item._id;
          //batch = {...batch, ...{parentId: item._id}} 
        }
      }
      setStoredBatches(tempMap);
      setInventoryItems(data); 
      //console.log(data); 
    }) 
    .catch((error) => {
      console.error('Fetch error:', error);
    }); 
  }, [inventoryUpdated]);

  const handleGoToOrderPage = (e) => {
    e.preventDefault(); 
    router.push ("/pages/orders");
  }

  const thStyle = " px-6 py-4 text-base sm:text-sm md:text-md lg:text-lg";
  const blockStyle = "m-5 p-5 flex flex-col justify-center items-center";

  return (
    <div className={blockStyle}>
      <button className="top-5 left-0 m-2 px-4 py-2 bg-blue-500 text-white rounded absolute"
                onClick={handleGoToOrderPage}>
        Go to order page
      </button>
      <h3>Current Inventory </h3>
      
      {/* Only show modal if an item is clicked */}
      {popupWindow && <PopupInvenotryItemWindow 
                        popupWindowContent={popupWindowContent} 
                        setPopupWindow={setPopupWindow}
                        inventoryUpdated={inventoryUpdated}
                        setInventoryUpdated={setInventoryUpdated}/>
      }

      <table className="border-collapse border border-sky-700 md:table-fixed w-90 font-light mx-4 my-4 table-auto">
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
              Location
            </th>
            <th scope="col" className={thStyle}>
              Create At
            </th>
            <th scope="col" className={thStyle}>
              Updated At
            </th>
          </tr>
        </thead>
        <tbody>
          {inventoryItems.map((item, index) => (
            item.hasOwnProperty('name') ?
              <InventoryRow
                key={index}
                _id={item._id}
                popupWindow={popupWindow}
                setPopupWindow={setPopupWindow}
                inventoryItems={inventoryItems}
                setInventoryItems={setInventoryItems}
                rowIndex={index}
                name={item.name}
                category={item.category}
                description={item.description}
                batches={item.batches}
                price={item.price}
                quantityInStock={item.quantityInStock}
                manufacturer={item.manufacturer}
                expirationDate={item.expirationDate}
                location={item.location}
                created_at={item.created_at}
                updated_at={item.updated_at}
              />
              : 
              <BatchItem
                key={index}
                _id={item.parentId}
                barcode={item.barcode}
                parentInfoMap={storedBatches}
                setPopupWindow={setPopupWindow}
                setPopupWindowContent={setPopupWindowContent}
                quantity={item.quantity}
                expirationDate={item.expirationDate}
                created_at={item.created_at}
                updated_at={item.updated_at}
              />
          ))}

        </tbody>
      </table>
    </div>
  );
}


/*
Use for FE testing: 

  // // TODO REMOVE JUST FOR FE TESTING 
  // const inventoryData = {
  //   name: 'Example Product',
  //   description: 'This is a sample product description.',
  //   category: 'prescription', // Should be one of 'prescription' or 'over-the-counter'
  //   manufacturer: 'Example Manufacturer',
  //   price: 19.99,
  //   quantityInStock: 100,
  //   location: 'Warehouse A',
  //   created_at: '2023-01-15', // Specify a valid date
  //   updated_at: '2023-09-15', // Specify a valid date
  //   batches: [
  //     {
  //       quantity: 100,
  //       expirationDate: '2025-01-31', // Specify a valid date
  //       created_at: '2024-12-26', // Specify a valid date
  //       updated_at: '2024-12-31', // Specify a valid date
  //     },
  //     {
  //       quantity: 101,
  //       expirationDate: '2025-01-31', // Specify a valid date
  //       created_at: '2024-12-26', // Specify a valid date
  //       updated_at: '2024-12-31', // Specify a valid date
  //     },
  //     {
  //       quantity: 102,
  //       expirationDate: '2025-01-31', // Specify a valid date
  //       created_at: '2024-12-26', // Specify a valid date
  //       updated_at: '2024-12-31', // Specify a valid date
  //     }
  //   ]
  // };
*/