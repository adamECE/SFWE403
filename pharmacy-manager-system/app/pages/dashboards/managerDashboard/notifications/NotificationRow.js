import React from "react";

export default function PrescriptionRow({
  popupWindow,
  setPopupWindow,
  setPopupWindowContent,
  _id,
  notifications,
  setNotifications,
  medID,
  medName,
  totalQuant,
  notiType,
  message,
  batchID,
  expirationDate,
  created_at,

}) {
  const handleRowOnClick = (e) => {
    e.preventDefault();

    setPopupWindow(true);

    setPopupWindowContent({
      _id: _id,
      expirationDate: expirationDate,
      medID: medID,
      medName: medName,
      totalQuant: totalQuant,
      notiType: notiType,
      message: message,
      batchID: batchID,
      expirationDate: expirationDate,
      created_at: created_at,
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
      <td className="whitespace-nowrap px-6 py-4"> {medName} </td>
      <td className="whitespace-nowrap px-6 py-4"> {notiType} </td>
      <td className="whitespace-nowrap px-6 py-4"> {created_at} </td>
      
    </tr>
  );
}
