export default function OrdersRow({
  orderID,
  popupWindow,
  setPopupWindow,
  setPopupWindowContent,
  medicationID,
  quantity,
  supplier,
  medicationName,
  orderDate,
  receptionDate,
  status,
}) {
  const handleRowOnClick = (e) => {
    e.preventDefault();

    setPopupWindow(true);

    setPopupWindowContent({
      orderID: orderID,
      medicationID: medicationID,
      medicationName: medicationName,
      quantity: quantity,
      supplier: supplier,
      orderDate: orderDate,
      receptionDate: receptionDate,
      status: status,
    });
  };

  return (
    <tr
      className={
        popupWindow
          ? "border-b dark:border-neutral-500 trBg"
          : "border-b dark:border-neutral-500 trBg hover:scale-105 cursor-pointer"
      }
      onClick={handleRowOnClick}
    >
      <td className="px-6 py-4"> {medicationName} </td>{" "}
      <td className="px-6 py-4"> {quantity} </td>{" "}
      <td className="px-6 py-4"> {supplier} </td>{" "}
      {/* Assuming these two should will be updated as date strings but not sure */}{" "}
      <td className="px-6 py-4"> {orderDate} </td>{" "}
      <td className="px-6 py-4"> {receptionDate} </td>{" "}
      <td className="px-6 py-4"> {status} </td>{" "}
    </tr>
  );
}
