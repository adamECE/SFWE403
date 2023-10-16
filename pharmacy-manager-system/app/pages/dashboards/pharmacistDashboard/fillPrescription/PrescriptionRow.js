import React from "react";

export default function PrescriptionRow({
  _id,
  popupWindow,
  setPopupWindow,
  setPopupWindowContent,
  deliveredBy,
  doctorName,
  dosage,
  medicationID,
  isValid,
  quantity,
  price,
  medicationName,
  medicationDescription,
  medicationManufacturer,
  filledInfo,
  refillPolicy,
  refillDueDate,
  refills,
  patient,
}) {
  const handleRowOnClick = (e) => {
    e.preventDefault();

    setPopupWindow(true);

    setPopupWindowContent({
      name: medicationName,
      _id: _id,
      description: medicationDescription,
      price: price,
      quantity: quantity,
      manufacturer: medicationManufacturer,
      filledInfo: filledInfo,
      medicationID: medicationID,
      deliveredBy: deliveredBy,
      doctorName: doctorName,
      dosage: dosage,
      medicationName: medicationName,
      refills: refills,
      patient: patient,
      refillDueDate,
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
      <td className="whitespace-nowrap px-6 py-4"> {medicationName} </td>{" "}
      <td className="whitespace-nowrap px-6 py-4"> {deliveredBy} </td>{" "}
      <td className="whitespace-nowrap px-6 py-4"> {doctorName} </td>{" "}
      <td className="whitespace-nowrap px-6 py-4"> {dosage} </td>{" "}
      <td className="whitespace-nowrap px-6 py-4">
        {" "}
        {new Date(refillDueDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })}{" "}
      </td>{" "}
      <td className="whitespace-nowrap px-6 py-4"> {refills} </td>{" "}
      <td className="whitespace-nowrap px-6 py-4">
        {" "}
        {isValid ? "Yes" : "No"}{" "}
      </td>{" "}
    </tr>
  );
}
