import {useState} from 'react'
import BatchItem from './BatchItem';

export default function InventoryRow({
  popupWindow, 
  inventoryItems, 
  setInventoryItems,
  rowIndex, 
  name,
  category,
  price,
  quantityInStock,
  manufacturer,
  batches, 
  location,
  created_at,
  updated_at
}) {

  const [batchDropDown, setBatchDropDown] = useState(false); 

  const handleRowOnClick = (e) => {
    e.preventDefault(); 
    let updatedInventoryItems = [...inventoryItems]; 

    if (!batchDropDown) {
      updatedInventoryItems.splice(rowIndex+1, 0, ...batches)
      setInventoryItems(updatedInventoryItems);
      
    } else {
      let tempArr = []; 
      for (const obj of updatedInventoryItems) {
        if (obj.hasOwnProperty('name')) {
          //obj['parentId'] = _id;
          tempArr.push(obj);
        }
      }
      setInventoryItems(tempArr);
    }

    setBatchDropDown(!batchDropDown); 
  } 


  return (
      <tr className={popupWindow ? 
        "border-b dark:border-neutral-500 trBg" : 
        "border-b dark:border-neutral-500 trBg hover:scale-105" } 
        onClick={handleRowOnClick}>
        <td className="whitespace-nowrap  px-6 py-4">  {name}             </td>
        <td className="whitespace-nowrap  px-6 py-4">  {category}         </td>
        <td className="whitespace-nowrap  px-6 py-4">  {price}            </td>
        <td className="whitespace-nowrap  px-6 py-4">  {quantityInStock}  </td>
        <td className="whitespace-nowrap  px-6 py-4">  {manufacturer}     </td>
        <td className="whitespace-nowrap  px-6 py-4">  {location}         </td>
        <td className="whitespace-nowrap  px-6 py-4">  {created_at}         </td>
        <td className="whitespace-nowrap  px-6 py-4">  {updated_at}         </td>
      </tr>
  );
}
