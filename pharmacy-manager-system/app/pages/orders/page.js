"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OrdersRow from "./OrdersRow";
import PopupOrdersItemWindow from "./PopupOrdersItemWindow"

export default function Orders() {
  const [orderListItems,     setOrderListItems]     = useState([]);
  const [popupWindow,        setPopupWindow]        = useState(false); 
  const [popupWindowContent, setPopupWindowContent] = useState({}); 

  const router = useRouter();

  const thStyle = " px-6 py-4";
  const blockStyle = "m-5 p-5 flex flex-col justify-center items-center ";

  const tempOrderListItems = [
    {
        medicationID: "abc123",
        quantity: 10,
        supplier: "PharmaCo",
        orderDate: new Date("2023-09-20"),
        receptionDate: new Date("2023-09-25"),
        status: "received"
    },
    {
        medicationID: "abc12344444",
        quantity: 10,
        supplier: "PharmaCo2",
        orderDate: new Date("2023-06-20"),
        receptionDate: new Date("2023-07-25"),
        status: "received"
    }
  ]

  // just set dummy data for now, update later 
  useEffect(() => {
    setOrderListItems(tempOrderListItems); 
  }, []);

  const handleGoToOrderPage = (e) => {
    e.preventDefault(); 
    router.push ("/pages/orders/placeNewOrder");
  }

  return (
    <div className={blockStyle}>
      <button className="top-5 left-0 m-2 px-4 py-2 bg-blue-500 text-white rounded absolute"
                onClick={handleGoToOrderPage}>
        Place a new order
      </button>
      <h3>Order List </h3>

      {/* Only show modal if an item is clicked */}
      {popupWindow && <PopupOrdersItemWindow 
                        popupWindowContent={popupWindowContent} 
                        setPopupWindow={setPopupWindow}/>
      }

      <table className="border-collapse border border-sky-700 md:table-fixed  font-light mx-4 my-4">
        <thead className="border-b bg-neutral-50 font-medium dark:border-neutral-500 dark:text-neutral-800">
          <tr>
            <th scope="col" className={thStyle}>
                Quantity
            </th>
            <th scope="col" className={thStyle}>
                Supplier
            </th>
            <th scope="col" className={thStyle}>
                Order Date
            </th>
            <th scope="col" className={thStyle}>
                Reception Date
            </th>
            <th scope="col" className={thStyle}>
                Status
            </th>
          </tr>
        </thead>
        <tbody>
          {orderListItems.map((item) => (
            <OrdersRow
              key={item.medicationID}
              medicationID={item.medicationID}
              popupWindow={popupWindow}
              setPopupWindow={setPopupWindow}
              setPopupWindowContent={setPopupWindowContent}
              quantity={item.quantity}
              supplier={item.supplier}
              orderDate={item.orderDate.toDateString()}
              receptionDate={item.receptionDate.toDateString()}
              status={item.status}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}