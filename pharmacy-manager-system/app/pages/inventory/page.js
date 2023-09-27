"use client";
import { useEffect, useState } from "react";
import InventoryRow from "./InventoryRow";

export default function Inventory() {
  // not sure how I'm actually gonna store this stuff
  const [inventoryItems, setInventoryItems] = useState([]);

  // Sample inventory data (to be replace with actual data from API)
  const sampleInventoryData = [
    {
      id: 1,
      name: "Item 1",
      category: "Category 1",
      price: 10.0,
      quantityInStock: 20,
      manufacturer: "Manufacturer 1",
      expirationDate: "2023-12-31",
      location: "Location 1",
    },
    {
      id: 2,
      name: "Item 2",
      category: "Category 2",
      price: 15.0,
      quantityInStock: 15,
      manufacturer: "Manufacturer 2",
      expirationDate: "2024-06-30",
      location: "Location 2",
    },
  ];

  useEffect(() => {
    // to be replaced  with actual API call to fetch inventory data
    setInventoryItems(sampleInventoryData);
  }, []);

  const inventoryStyles = {
    marign: "10 auto",
    border: "solid 2px black",
    padding: "20px",
    backgroundColor: "#86BBD8",
    width: "100%",
    position: "absolute",
    left: "0px",
  };

  const thStyle = " px-6 py-4";
  const blockStyle = "m-5  p-5 flex flex-col justify-center items-center ";
  return (
    <div className={blockStyle}>
      <h3>Current Inventory </h3>
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
              Quantity In Stock
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
            <th scope="col" className={thStyle}>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {inventoryItems.map((item) => (
            <InventoryRow
              key={item.id}
              name={item.name}
              category={item.category}
              price={item.price}
              quantityInStock={item.quantityInStock}
              manufacturer={item.manufacturer}
              expirationDate={item.expirationDate}
              location={item.location}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
