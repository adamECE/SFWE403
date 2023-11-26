"use client";
import React, { useState, useEffect } from "react";;
import DataTable, { ExpanderComponentProps } from "react-data-table-component";
import LinearProgress from "@mui/material/LinearProgress";

import Box from "@mui/material/Box";

export default function TabsDefault() {
  const tabStyle = `block rounded border-x-0 border-b-2 mx-1 my-3 border-t-0 border-transparent bg-cyan-300 px-7 pb-3.5 pt-4 text-xs text-black font-medium uppercase leading-tight 
    hover:isolate
    hover:border-transparent
    hover:bg-neutral-100
    focus:isolate
    focus:border-transparent
    data-[te-nav-active]:border-primary
    data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400`;
  const [activeTab, setActiveTab] = useState("items-added");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [inventoryData, setInventoryData] = useState([]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };
  useEffect(() => {
    console.log("activeTab:", activeTab);
  }, [activeTab]);
  const formatDateForApi = (date) => {
    const [year, month, day] = date.split("-");
    const formattedDate = `${month}/${day}/${year}`;
    console.log("Formatted Date for API:", formattedDate);
    return formattedDate;
  };

  const fetchInventoryData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:3030/pharmacy-0x2/api/inventory/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          from: formatDateForApi(startDate),
          to: formatDateForApi(endDate)
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Inventory Data updated:", data);
        setInventoryData(data);
        setPending(false);
      } else {
        console.error("Failed to fetch inventory data");
        setPending(false);
      }
    } catch (error) {
      console.error("Error fetching inventory data", error);
      setPending(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      setPending(true);
      fetchInventoryData();
    }
  }, [startDate, endDate]);

  const [pending, setPending] = useState(true);
  const inputStyle =
    "shadow appearance-none border rounded text-sm  w-full py-2 px-2 text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline";

  const labelSyle = "block text-gray-500 text-sm font-bold mb-2";
  const CustomLoader = () => (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  );
  const defaultColumns = [
    {
      name: "MedicationID",
      selector: (row) => row.medicationInfo.id,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.itemType,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => {
        return (
          <>
            {" "}
            {row.date} <br /> {row.time}{" "}
          </>
        );
      },
    },
    {
      name: "Batch Barcode",
      selector: (row) => row.batch.barcode,
      sortable: true,
    },
    {
      name: "Expiration Date",
      selector: (row) => row.batch.expirationDate,
      sortable: true,
    },
    {
      name: "Quantity",
      selector: (row) => row.batch.quantity,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => row.date,
      sortable: true,
    },
    {
      name: "Time",
      selector: (row) => row.time,
      sortable: true,
    },
  ];
  const columnsForRemoved = [
    {
      name: "Batch Quantity",
      selector: (row) => row.batch.quantity,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => row.date,
      sortable: true,
    },
    {
      name: "Item Type",
      selector: (row) => row.itemType,
      sortable: true,
    },
    {
      name: "Medication Manufacturer",
      selector: (row) => row.medicationInfo.manufacturer,
      sortable: true,
    },
    {
      name: "Medication Name",
      selector: (row) => row.medicationInfo.name,
      sortable: true,
    },
    {
      name: "Time",
      selector: (row) => row.time,
      sortable: true,
    },
  ];

  const customPendingContent = (
    <div>
      {/* Add your custom content here */}
      <p>Loading...</p>
    </div>
  );
  

  return (
    <>
      <div>
        <label htmlFor="start-date">Start Date: </label>
        <input
          type="date"
          id="start-date"
          value={startDate}
          onChange={(e) => {
            console.log("Start Date selected:", e.target.value);
            setStartDate(e.target.value);
          }}
        />
        <label htmlFor="end-date">End Date: </label>
        <input
          type="date"
          id="end-date"
          value={endDate}
          onChange={(e) => {
            console.log("End Date selected:", e.target.value);
            setEndDate(e.target.value);
          }}
        />
      </div>
      {startDate && endDate ? (
        <div>
          <div className="flex border-b-0 mx-5">
            <ul className="flex w-full" role="tablist" data-te-nav-ref>
              <li role="presentation" className="flex-1">
                <a
                  href="#items-added"
                  className={`${
                    activeTab === "items-added"
                      ? "text-primary bg-sky-100"
                      : "text-neutral-500"
                  } ${tabStyle}`}
                  data-te-toggle="pill"
                  data-te-target="#items-added"
                  role="tab"
                  aria-controls="items-added"
                  aria-selected={activeTab === "items-added"}
                  onClick={() => handleTabClick("items-added")}
                >
                  Items Added
                </a>
              </li>
              <li role="presentation" className="flex-1">
                <a
                  href="#items-removed"
                  className={`${
                    activeTab === "items-removed"
                      ? "text-primary bg-sky-100"
                      : "text-neutral-500"
                  } ${tabStyle}`}
                  data-te-toggle="pill"
                  data-te-target="#items-removed"
                  role="tab"
                  aria-controls="items-removed"
                  aria-selected={activeTab === "items-removed"}
                  onClick={() => handleTabClick("items-removed")}
                >
                  Items Removed
                </a>
              </li>
            </ul>
          </div>
          <div className="mb-6 mx-5">
            <div className="px-5 text-white">
              {pending ? (
                // Display custom content when data is pending
                customPendingContent
              ) : activeTab === "items-added" ? (
                inventoryData &&
                Array.isArray(inventoryData.itemsAdded) &&
                inventoryData.itemsAdded.length > 0 ? (
                  <DataTable
                    title="Items Added"
                    columns={defaultColumns}
                    data={inventoryData.itemsAdded}
                    pagination
                  />
                ) : (
                  // Display DataTable when inventoryData exists
                  <DataTable
                    title="Items Added"
                    columns={defaultColumns}
                    data={inventoryData.itemsAdded}
                    pagination
                  />
                )
              ) : activeTab === "items-removed" ? (
                Array.isArray(inventoryData.itemsRemoved) &&
                inventoryData.itemsRemoved.length > 0 ? (
                  <DataTable
                    title="Items Removed"
                    columns={columnsForRemoved}
                    data={inventoryData.itemsRemoved}
                    pagination
                  />
                ) : (
                  <DataTable
                    title="Items Removed"
                    columns={columnsForRemoved}
                    data={inventoryData.itemsRemoved}
                    pagination
                  />
                )
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
  
  

                }