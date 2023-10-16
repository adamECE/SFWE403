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
  setShowOrderForm,
  setOrderPopupWindowContent,
  medicine,
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
      medicine: medicine,
    });
  };
  const tdStyle = "px-6 py-4 text-base sm:text-sm md:text-md";
  const options = { year: "numeric", month: "long", day: "numeric" };
  const created_at_date = new Date(created_at);
  const created_at_str = new Intl.DateTimeFormat("en-US", options).format(
    created_at_date
  );
  return (
    <tr
      className={
        popupWindow
          ? "border-b dark:border-neutral-500 trBg"
          : "border-b dark:border-neutral-500 trBg hover:scale-105"
      }
    >
      <td className={tdStyle}> {medName} </td>
      <td className={tdStyle}> {notiType} </td>
      <td className={tdStyle}> {created_at} </td>
      <td className={tdStyle} onClick={handleRowOnClick}>
        {" "}
        <button className="bg-blue-500 text-white rounded">
          View Item Info
        </button>{" "}
      </td>
    </tr>
  );
}
