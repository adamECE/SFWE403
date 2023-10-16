"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import React from 'react';
import NotificationRow from "./NotificationRow";
import OrderFormPopup from "./OrderFormPopup";
import PopupNotificationWindow from "./PopupNotificationWindow.js"

export default function Notifications() {
  const [notifications,     setNotifications]     = useState([]);
  const [popupWindow,        setPopupWindow]        = useState(false); 
  const [popupWindowContent, setPopupWindowContent] = useState({}); 
  const [notificationsUpdated,   setNotificationsUpdated]   = useState(false);
  const [orderPopupWindowContent, setOrderPopupWindowContent] = useState({});
  const [showOrderForm, setShowOrderForm] = useState(false);

 
  const router = useRouter();

  useEffect(() => {
    setNotificationsUpdated(!notificationsUpdated); 
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("token"); // get auth token from localStorage
    fetch("http://127.0.0.1:3030/pharmacy-0x2/api/inventory/get-notis", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // include bearer token in the Autho header
      },
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Network response error');
      }
      return res.json();
    })
    .then((data) => {
      setNotifications(data);
    }) 
    .catch((error) => {
      console.error('Fetch error:', error);
    }); 
  }, [notificationsUpdated]);

  const handleGoToOrderPage = (e) => {
    e.preventDefault(); 
    router.push ("/pages/orders");
  }

  const thStyle = " px-6 py-4 text-base sm:text-sm md:text-md lg:text-lg";
  const blockStyle = "m-5 p-5 flex flex-col justify-center items-center";

  return (
    <div className={blockStyle}>
      <button className="top-5 left-0 m-2 px-4 py-2 bg-blue-500 text-white rounded absolute"
                onClick={handleGoToOrderPage}>
        Go to order page
      </button>
      <h3>Open Notifications </h3>
      
      {/* Only show modal if an item is clicked */}
      {popupWindow && <PopupNotificationWindow 
                        popupWindowContent={popupWindowContent} 
                        setPopupWindow={setPopupWindow}
                        notificationsUpdated={notificationsUpdated}
                        setNotificationsUpdated={setNotificationsUpdated}
                        orderPopupWindowContent={orderPopupWindowContent}
                        setOrderPopupWindowContent={setOrderPopupWindowContent}
                        setShowOrderForm={setShowOrderForm}
                        />
      }
      {showOrderForm && (
        <OrderFormPopup
          setSecondPopup={setShowOrderForm}
          orderPopupWindowContent={orderPopupWindowContent}
        />
      )}

      <table className="border-collapse border border-sky-700 md:table-fixed w-90 font-light mx-4 my-4 table-auto">
        <thead className="border-b bg-neutral-50 font-medium dark:border-neutral-500 dark:text-neutral-800">
          <tr>
            <th scope="col" className={thStyle}>
              Name
            </th>
            <th scope="col" className={thStyle}>
              Notification Type
            </th>
            <th scope="col" className={thStyle}>
              Created At
            </th>
            <th scope="col" className={thStyle}>
              View
            </th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((item) => (
              <NotificationRow
                _id={item._id}
                popupWindow={popupWindow}
                setPopupWindow={setPopupWindow}
                setPopupWindowContent={setPopupWindowContent}
                notificationsItems={notifications}
                setNotifications={setNotifications}
                medID={item.medID}
                medName={item.medName}
                totalQuant={item.totalQuant}
                notiType={item.notiType}
                message={item.message}
                batchID={item.batchID}
                expirationDate={item.expirationDate}
                created_at={item.created_at}
                medicine={item}
              />
          ))}

        </tbody>
      </table>
    </div>
  );
}
