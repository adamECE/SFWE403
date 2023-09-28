import {useState} from 'react'

export default function Inventory({
  name,
  category,
  price,
  quantityInStock,
  manufacturer,
  expirationDate,
  location,
}) {

  const handleRowOnClick = (e) => {
    e.preventDefault(); 

    

  } 

  return (
    <tr className="border-b dark:border-neutral-500 trBg hover:scale-105" onClick={handleRowOnClick}>
      <td className="whitespace-nowrap  px-6 py-4">  {name} </td>{" "}
      <td className="whitespace-nowrap  px-6 py-4">  {category} </td>{" "}
      <td className="whitespace-nowrap  px-6 py-4">  {price} </td>{" "}
      <td className="whitespace-nowrap  px-6 py-4">  {quantityInStock} </td>{" "}
      <td className="whitespace-nowrap  px-6 py-4">  {manufacturer} </td>{" "}
      <td className="whitespace-nowrap  px-6 py-4">  {expirationDate} </td>{" "}
      <td className="whitespace-nowrap  px-6 py-4">  {location} </td>{" "}
    </tr>
  );
}
