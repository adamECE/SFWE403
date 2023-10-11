import React from "react";

export default function PrescriptionRow({
  popupWindow,
  setPopupWindow,
  setPopupWindowContent,
  name,
  _id,
  medicationDescription,
  medicationManufacturer,
  price,
  quantityInStock,
  manufacturer,
  barcode,
  expirationDate,
  location,
  created_at,
  updated_at,
  batches,
  doctorName,
  deliveredBy,
  isValid,
  quantity,
  dosage,
  refillDueDate,
  refills,
  medicationID
}) {
  const handleRowOnClick = (e) => {
    e.preventDefault();

    setPopupWindow(true);

    setPopupWindowContent({
      name: name,
      _id: _id,
      description: medicationDescription,
      price: price,
      quantity: quantity,
      quantityInStock: quantityInStock,
      manufacturer: medicationManufacturer,
      barcode: barcode,
      expirationDate: expirationDate,
      location: location,
      created_at: created_at,
      updated_at: updated_at,
      batches: batches,
      medicationID: medicationID
    });
  };

  return (
    <tr
      className={
        popupWindow
          ? "border-b dark:border-neutral-500 trBg"
          : "border-b dark:border-neutral-500 trBg hover:scale-105"
      }
      onClick={handleRowOnClick}
    >
      <td className="whitespace-nowrap px-6 py-4"> {deliveredBy} </td>
      <td className="whitespace-nowrap px-6 py-4"> {doctorName} </td>
      <td className="whitespace-nowrap px-6 py-4"> {_id} </td>
      <td className="whitespace-nowrap px-6 py-4"> {dosage} </td>
      <td className="whitespace-nowrap px-6 py-4"> {refillDueDate} </td>
      <td className="whitespace-nowrap px-6 py-4"> {refills} </td>
      
        
      
    </tr>
  );
}
