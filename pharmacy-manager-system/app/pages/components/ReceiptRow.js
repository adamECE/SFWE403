export default function ReceiptRow({ name, price, qnt }) {
  return (
    <div className="flex w-full">
      <div className="px-6 py-2 flex-1"> {name} </div>{" "}
      <div className="px-6 py-2 flex-1"> {qnt} </div>{" "}
      <div className="px-6 py-2 flex-1"> {price} </div>{" "}
    </div>
  );
}
