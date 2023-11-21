"use client";
import React, { useState } from "react";
import AuthLogs from "../../../components/logs/auth";
import InventoryLogs from "../../../components/logs/inventory";
import PrescriptionLogs from "../../../components/logs/prescription";
import PurchaseLogs from "@/pages/components/logs/purchase";

export default function TabsDefault() {
  const tabStyle = `block rounded border-x-0 border-b-2 mx-1 my-3 border-t-0 border-transparent bg-cyan-300 px-7 pb-3.5 pt-4 text-xs text-black font-medium uppercase leading-tight 
    hover:isolate
    hover:border-transparent
    hover:bg-neutral-100
    focus:isolate
    focus:border-transparent
    data-[te-nav-active]:border-primary
    data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400`;
  const [activeTab, setActiveTab] = useState("auth");
  const [patientList, setPatientList] = useState();
  const [prescriptioLogList, setPrescriptioLogList] = useState();
  const [purchaseLogList, setPurchaseLogList] = useState();
  const [authLogstList, setAuthLogstList] = useState();
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <>
      <div className="flex border-b-0 mx-5">
        <ul className="flex w-full" role="tablist" data-te-nav-ref>
          <li role="presentation" className="flex-1">
            <a
              href="#auth"
              className={` ${tabStyle} ${
                activeTab === "auth"
                  ? "text-primary bg-sky-100"
                  : "text-neutral-500"
              } `}
              data-te-toggle="pill"
              data-te-target="#auth"
              data-te-nav-active
              role="tab"
              aria-controls="auth"
              aria-selected={activeTab === "auth"}
              onClick={() => handleTabClick("auth")}
            >
              Authentication
            </a>
          </li>
          <li role="presentation" className="flex-1">
            <a
              href="#prescription"
              className={` ${
                activeTab === "prescription"
                  ? "text-primary bg-sky-100"
                  : "text-neutral-500"
              } ${tabStyle}`}
              data-te-toggle="pill"
              data-te-target="#prescription"
              role="tab"
              aria-controls="prescription"
              aria-selected={activeTab === "prescription"}
              onClick={() => handleTabClick("prescription")}
            >
              Prescription filled
            </a>
          </li>
          <li role="presentation" className="flex-1">
            <a
              href="#inventory"
              className={` ${
                activeTab === "inventory"
                  ? "text-primary bg-sky-100"
                  : "text-neutral-500"
              } ${tabStyle}`}
              data-te-toggle="pill"
              data-te-target="#inventory"
              role="tab"
              aria-controls="inventory"
              aria-selected={activeTab === "inventory"}
              onClick={() => handleTabClick("inventory")}
            >
              Inventory update
            </a>
          </li>
          <li role="presentation" className="flex-1">
            <a
              href="#purchase"
              className={`disabled  ${
                activeTab === "purchase"
                  ? "text-primary bg-sky-100"
                  : "text-neutral-400"
              } ${tabStyle}`}
              data-te-toggle="pill"
              data-te-target="#purchase"
              role="tab"
              aria-controls="purchase"
              aria-selected={activeTab === "purchase"}
              onClick={() => handleTabClick("purchase")}
            >
              Purchases
            </a>
          </li>
        </ul>
      </div>

      <div className="mb-6 mx-5">
        <div
          className={`${
            activeTab === "auth" ? "block " : "hide "
          } transition-opacity duration-150 ease-linear data-[te-tab-active]:block`}
          id="auth"
          role="tabpanel"
          aria-labelledby="auth-tab"
          data-te-tab-active
        >
          <AuthLogs
            authLogstList={authLogstList}
            setAuthLogstList={setAuthLogstList}
          />
        </div>
        <div
          className={`${
            activeTab === "prescription" ? "block" : "hide "
          } transition-opacity duration-150 ease-linear data-[te-tab-active]:block`}
          id="prescription"
          role="tabpanel"
          aria-labelledby="prescription-tab"
        >
          <PrescriptionLogs
            prescriptioLogList={prescriptioLogList}
            setPrescriptioLogList={setPrescriptioLogList}
          />
        </div>
        <div
          className={`${
            activeTab === "inventory" ? "block" : "hide "
          } transition-opacity duration-150 ease-linear data-[te-tab-active]:block`}
          id="inventory"
          role="tabpanel"
          aria-labelledby="prescription-tab"
        >
          <InventoryLogs
            patientList={patientList}
            setPatientList={setPatientList}
          />
        </div>
        <div
          className={`${
            activeTab === "purchase" ? "block" : "hide "
          } transition-opacity duration-150 ease-linear data-[te-tab-active]:block`}
          id="purchase"
          role="tabpanel"
          aria-labelledby="purchase-tab"
        >
          <PurchaseLogs
            purchaseLogList={purchaseLogList}
            setPurchaseLogList={setPurchaseLogList}
          />
        </div>
      </div>
    </>
  );
}
