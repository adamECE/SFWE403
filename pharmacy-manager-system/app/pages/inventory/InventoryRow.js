export default function Inventory({
  name,
  category,
  price,
  quantityInStock,
  manufacturer,
  expirationDate,
  location,
}) {
  const tableRowStyles = {
    border: "solid 1px black",
  };

  const tableItemStyles = {
    border: "solid 1px black",
  };

  const viewItemButtonStyles = {
    width: "100%",
  };

  return (
    <tr className="border-b dark:border-neutral-500 trBg">
      <td className="whitespace-nowrap  px-6 py-4 "> {name} </td>{" "}
      <td className="whitespace-nowrap  px-6 py-4"> {category} </td>{" "}
      <td className="whitespace-nowrap  px-6 py-4"> {price} </td>{" "}
      <td className="whitespace-nowrap  px-6 py-4"> {quantityInStock} </td>{" "}
      <td className="whitespace-nowrap  px-6 py-4"> {manufacturer} </td>{" "}
      <td className="whitespace-nowrap  px-6 py-4"> {expirationDate} </td>{" "}
      <td className="whitespace-nowrap  px-6 py-4"> {location} </td>{" "}
      <td className="whitespace-nowrap  px-6 py-4">
        <button style={viewItemButtonStyles}> View Item </button>{" "}
      </td>{" "}
    </tr>
  );
}
