"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OrdersRow from "./OrdersRow";
import PopupOrdersItemWindow from "./PopupOrdersItemWindow";

export default function Orders() {
  const [orderListItems, setOrderListItems] = useState([]);
  const [popupWindow, setPopupWindow] = useState(false);
  const [popupWindowContent, setPopupWindowContent] = useState({});

  const router = useRouter();

  const thStyle = " px-6 py-4";
  const blockStyle = "m-5 p-5 flex flex-col justify-center items-center ";
  const [orderUpdated, setOrderUpdated] = useState(false);
  useEffect(() => {
    setOrderUpdated(!orderUpdated);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token"); // get auth token from localStorage
    fetch("http://127.0.0.1:3030/pharmacy-0x2/api/inventory/order-list", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // include bearer token in the Autho header
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response error");
        }
        return res.json();
      })
      .then((data) => {
        setOrderListItems(data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }, [orderUpdated]);

  const handleGoToInvPage = (e) => {
    e.preventDefault();
    router.push("/pages/inventory");
  };

  return (
    <div className={blockStyle}>
      <button
        className="top-5 left-0 m-2 px-4 py-2 bgCor text-white rounded absolute"
        onClick={handleGoToInvPage}
      >
        Go to Inventory{" "}
      </button>{" "}
      <h3> Order List </h3> {/* Only show modal if an item is clicked */}{" "}
      {popupWindow && (
        <PopupOrdersItemWindow
          popupWindowContent={popupWindowContent}
          setPopupWindow={setPopupWindow}
          setOrderUpdated={setOrderUpdated}
          orderUpdated={orderUpdated}
        />
      )}{" "}
      <table className="border-collapse border border-sky-700 md:table-fixed  font-light mx-4 my-4">
        <thead className="border-b bg-neutral-50 font-medium dark:border-neutral-500 dark:text-neutral-800">
          <tr>
            <th scope="col" className={thStyle}>
              Name{" "}
            </th>{" "}
            <th scope="col" className={thStyle}>
              Quantity{" "}
            </th>{" "}
            <th scope="col" className={thStyle}>
              Supplier{" "}
            </th>{" "}
            <th scope="col" className={thStyle}>
              Order Date{" "}
            </th>{" "}
            <th scope="col" className={thStyle}>
              Reception Date{" "}
            </th>{" "}
            <th scope="col" className={thStyle}>
              Status{" "}
            </th>{" "}
          </tr>{" "}
        </thead>{" "}
        <tbody>
          {" "}
          {orderListItems.map((item) => (
            <OrdersRow
              key={item.medicationID}
              orderID={item._id}
              medicationID={item.medicationID}
              popupWindow={popupWindow}
              setPopupWindow={setPopupWindow}
              setPopupWindowContent={setPopupWindowContent}
              quantity={item.quantity}
              supplier={item.supplier}
              medicationName={
                item.medicationName ? item.medicationName : "Name not found"
              }
              orderDate={new Date(item.orderDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
              receptionDate={
                item.receptionDate
                  ? new Date(item.receptionDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                  : "---"
              }
              status={item.status}
            />
          ))}{" "}
        </tbody>{" "}
      </table>{" "}
    </div>
  );
}
