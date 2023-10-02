

export default function OrdersRow({
    popupWindow, 
    setPopupWindow,
    setPopupWindowContent, 
    medicationID,
    quantity,
    supplier,
    orderDate,
    receptionDate,
    status
  }) {
  
    const handleRowOnClick = (e) => {
      e.preventDefault(); 
  
      setPopupWindow(true); 
  
      setPopupWindowContent({
        medicationID: medicationID, 
        quantity: quantity,
        supplier: supplier,
        orderDate: orderDate,
        receptionDate: receptionDate,
        status: status,
      }) 
  
    } 
  
    return (
      <tr className={popupWindow ? 
        "border-b dark:border-neutral-500 trBg" : 
        "border-b dark:border-neutral-500 trBg hover:scale-105" } 
        onClick={handleRowOnClick}>
        <td className="whitespace-nowrap  px-6 py-4">  {quantity}      </td>
        <td className="whitespace-nowrap  px-6 py-4">  {supplier}      </td>
        {/* Assuming these two should will be updated as date strings but not sure */}
        <td className="whitespace-nowrap  px-6 py-4">  {orderDate}     </td>
        <td className="whitespace-nowrap  px-6 py-4">  {receptionDate} </td>
        <td className="whitespace-nowrap  px-6 py-4">  {status}        </td>

      </tr>
    );
  }
  