import { useState } from "react";
import BatchItem from "./BatchItem";

export default function InventoryRow({
  _id,
  popupWindow,
  setShowOrderForm,
  setOrderPopupWindowContent,
  inventoryItems,
  setInventoryItems,
  rowIndex,
  name,
  category,
  description,
  price,
  quantityInStock,
  manufacturer,
  batches,
  location,
  created_at,
  updated_at,
}) {
  const [batchDropDown, setBatchDropDown] = useState(false);

  const handleRowOnClick = (e) => {
    e.preventDefault();
    let updatedInventoryItems = [...inventoryItems];

    if (!batchDropDown) {
      updatedInventoryItems.splice(rowIndex + 1, 0, ...batches);
      setInventoryItems(updatedInventoryItems);
    } else {
      let tempArr = [];
      for (const obj of updatedInventoryItems) {
        if (obj.hasOwnProperty("name")) {
          tempArr.push(obj);
        }
      }
      setInventoryItems(tempArr);
    }

    setBatchDropDown(!batchDropDown);
  };

  const handlePlaceOrderOnClick = (e) => {
    e.preventDefault();
    setOrderPopupWindowContent({
      medicationID: _id,
      name,
      category,
      description,
      price,
      quantityInStock,
      manufacturer,
      location,
      created_at,
      updated_at,
    });

    setShowOrderForm(true);
  };

  const tdStyle = "px-6 py-4 text-base sm:text-sm md:text-md";

  const options = { year: "numeric", month: "long", day: "numeric" };
  const created_at_date = new Date(created_at);
  const created_at_str = new Intl.DateTimeFormat("en-US", options).format(
    created_at_date
  );
  const updated_at_date = new Date(updated_at);
  const updated_at_str = new Intl.DateTimeFormat("en-US", options).format(
    updated_at_date
  );

  return (
    <tr
      className={
        popupWindow
          ? "border-b dark:border-neutral-500 trBg"
          : "border-b dark:border-neutral-500 trBg hover:scale-105"
      }
    >
      <td className={tdStyle}> {name} </td>
      <td className={tdStyle}> {category} </td>
      <td className={tdStyle}> ${price} </td>
      <td className={tdStyle}> {quantityInStock} </td>
      <td className={tdStyle}> {manufacturer} </td>
      <td className={tdStyle}> {location} </td>
      <td className={tdStyle}>
        {" "}
        <button
          className="bg-blue-500 p-1 text-white rounded flex items-center justify-center text-center hover:scale-110 "
          onClick={handlePlaceOrderOnClick}
        >
          Place Order
        </button>{" "}
      </td>
      <td className={tdStyle} onClick={handleRowOnClick}>
        {" "}
        <button className="bg-blue-500 p-1 text-white rounded flex items-center justify-center text-center hover:scale-110 ">
          View batches
        </button>{" "}
      </td>
    </tr>
  );
}
