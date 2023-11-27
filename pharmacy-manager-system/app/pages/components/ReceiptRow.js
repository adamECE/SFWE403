export default function ReceiptRow({ name, price, qnt }) {
  return (
    <tr>
      <td className="px-6 py-2"> {name} </td>{" "}
      <td className="px-6 py-2"> {qnt} </td>{" "}
      <td className="px-6 py-2"> {price} </td>{" "}
    </tr>
  );
}
