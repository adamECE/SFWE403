export default function BatchItem({
    setPopupWindow,
    setPopupWindowContent, 
    _id,
    barcode,
    quantity,
    expirationDate, 
    created_at,
    updated_at
  }) {
  
    const handleRowOnClick = (e) => {
      e.preventDefault(); 
  
      setPopupWindow(true); 
      console.log(_id); 
      setPopupWindowContent({
        _id: _id,
        barcode: barcode, 
        quantity: quantity,
        expirationDate: expirationDate,
        created_at: created_at,
        updated_at: updated_at 
      }) 


  
    } 
  
    return (
      <tr className="dark:border-neutral-500 trBg bg-custom-red scale-90 hover:scale-95"  
        onClick={handleRowOnClick}>
        <td className="whitespace-nowrap  px-6 py-4" colSpan={2}>  Quantity: {quantity}           </td>
        <td className="whitespace-nowrap  px-6 py-4" colSpan={2}>  Exp Date: {expirationDate}     </td>
        <td className="whitespace-nowrap  px-6 py-4" colSpan={2}>  Created At: {created_at}         </td>
        <td className="whitespace-nowrap  px-6 py-4" colSpan={2}>  Updated At: {updated_at}         </td>
      </tr>
    );
  }
  

  /*

  */