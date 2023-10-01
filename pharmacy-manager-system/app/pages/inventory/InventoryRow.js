

export default function Inventory({
  popupWindow, 
  setPopupWindow,
  setPopupWindowContent, 
  name,
  description, 
  category,
  price,
  quantityInStock,
  manufacturer,
  barcode,
  expirationDate,
  location,
  created_at,
  updated_at
}) {

  const handleRowOnClick = (e) => {
    e.preventDefault(); 

    setPopupWindow(true); 

    setPopupWindowContent({
      name: name,
      description: description, 
      category: category, 
      price: price,
      quantityInStock: quantityInStock,
      manufacturer: manufacturer,
      barcode: barcode, 
      expirationDate: expirationDate,
      location: location,
      created_at: created_at,
      updated_at: updated_at 
    }) 

  } 

  return (
    <tr className={popupWindow ? 
      "border-b dark:border-neutral-500 trBg" : 
      "border-b dark:border-neutral-500 trBg hover:scale-105" } 
      onClick={handleRowOnClick}>
      <td className="whitespace-nowrap  px-6 py-4">  {name}             </td>{" "}
      <td className="whitespace-nowrap  px-6 py-4">  {category}         </td>{" "}
      <td className="whitespace-nowrap  px-6 py-4">  {price}            </td>{" "}
      <td className="whitespace-nowrap  px-6 py-4">  {quantityInStock}  </td>{" "}
      <td className="whitespace-nowrap  px-6 py-4">  {manufacturer}     </td>{" "}
      <td className="whitespace-nowrap  px-6 py-4">  {expirationDate}   </td>{" "}
      <td className="whitespace-nowrap  px-6 py-4">  {location}         </td>{" "}
    </tr>
  );
}
