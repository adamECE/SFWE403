"use client";
import { useEffect, useState } from "react";
import InventoryRow from "./InventoryRow";
import PopupInvenotryItemWindow from "./PopupInventoryItemWindow"

export default function Inventory() {
  // not sure how I'm actually gonna store this stuff
  const [inventoryItems,     setInventoryItems] = useState([]);
  const [popupWindow,        setPopupWindow]        = useState(false); 
  const [popupWindowContent, setPopupWindowContent] = useState({}); 

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
    }); 
  }, []);

  const thStyle = " px-6 py-4";
  const blockStyle = "m-5  p-5 flex flex-col justify-center items-center ";
  return (
    <div className={blockStyle}>
      <h3>Current Inventory </h3>

      {/* Only show modal if an item is clicked */}
      {popupWindow && <PopupInvenotryItemWindow 
                        popupWindowContent={popupWindowContent} 
                        setPopupWindow={setPopupWindow}/>
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
              key={item._id}
              _id={item._id}
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