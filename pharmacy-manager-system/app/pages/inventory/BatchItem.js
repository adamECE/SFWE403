export default function BatchItem({
    setPopupWindow,
    setPopupWindowContent, 
    parentInfoMap,
    _id,
    barcode,
    quantity,
    expirationDate, 
    created_at,
    updated_at,
  }) {
  
    const handleRowOnClick = (e) => {
      e.preventDefault(); 
  
      setPopupWindow(true); 
      console.log(parentInfoMap.get(barcode))
      setPopupWindowContent({
        _id: _id,
        barcode: barcode,
        name:  parentInfoMap.get(barcode).name,
        description: parentInfoMap.get(barcode).description, 
        price: parentInfoMap.get(barcode).price, 
        manufacturer: parentInfoMap.get(barcode).manufacturer, 
        quantity: quantity,
        location: parentInfoMap.get(barcode).location, 
        category: parentInfoMap.get(barcode).category, 
        expirationDate: expirationDate,
        created_at: created_at,
        updated_at: updated_at 
      }) 
    } 

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const expirationDate_date = new Date(expirationDate);
    const exp_date_str  = new Intl.DateTimeFormat('en-US', options).format(expirationDate_date);
    const created_at_date = new Date(created_at);
    const created_at_str  = new Intl.DateTimeFormat('en-US', options).format(created_at_date);
    const updated_at_date = new Date(updated_at);
    const updated_at_str  = new Intl.DateTimeFormat('en-US', options).format(updated_at_date);
  
    return (
      <tr className="dark:border-neutral-500 trBg bg-custom-red scale-90 hover:scale-95"  
        onClick={handleRowOnClick}>
        <td className="whitespace-nowrap  px-6 py-4" colSpan={2}>  Quantity: {quantity}           </td>
        <td className="whitespace-nowrap  px-6 py-4" colSpan={2}>  Exp Date: {exp_date_str}     </td>
        <td className="whitespace-nowrap  px-6 py-4" colSpan={2}>  Created At: {created_at_str}         </td>
        <td className="whitespace-nowrap  px-6 py-4" colSpan={2}>  Updated At: {updated_at_str}         </td>
      </tr>
    );
  }
  

  /*

  */