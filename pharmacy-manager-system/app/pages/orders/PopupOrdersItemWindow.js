'use client'
import { useState } from "react";

export default function PopupOrdersItemWindow({
    popupWindowContent, 
    setPopupWindow, 
}) {

    const handleCloseModalBtn = (e) => {
        e.preventDefault(); 
        setPopupWindow(false); 
    } 

    const handleAcceptOrder = (e) => {
        e.preventDefault(); 
        // TODO: Add backend 
        console.log('Order accepted');
    }

    return (
        <div id="myModal" className="modal p-10px fixed w-full h-full top-0 left-0 flex items-center justify-center">
        <div className="modal-content border-2 border-gray-800 border-opacity-100 bg-white p-8 rounded shadow-lg relative">
            <button className="top-0 right-0 m-2 px-4 py-2 bg-blue-500 text-white rounded absolute"
                    onClick={handleCloseModalBtn}>
                &times;
            </button>
            <div className="px-4 py-2">
                <b>Quantity:</b> {popupWindowContent.quantity} 
            </div>
            <div className="px-4 py-2">
                <b>Supplier:</b> {popupWindowContent.supplier} 
            </div>
            <div className="px-4 py-2">
                <b>Order Date:</b> ${popupWindowContent.orderDate} 
            </div>
            <div className="px-4 py-2">
                <b>Reception Date:</b> {popupWindowContent.receptionDate} 
            </div>
            <div className="px-4 py-2">
                <b>Status:</b> {popupWindowContent.status} 
            </div>
            <button className="bottom-0 right-0 m-2 px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={handleAcceptOrder}>
                Accept Order
            </button>
        </div>
        </div>
    );
  }