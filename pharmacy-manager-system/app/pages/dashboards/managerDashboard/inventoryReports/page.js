"use client";
import React, { useState, useEffect } from "react";
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
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [inventoryData, setInventoryData] = useState({});

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
      const response = await fetch(
        "http://127.0.0.1:3030/pharmacy-0x2/api/inventory/report",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            from: formatDateForApi(startDate),
            to: formatDateForApi(endDate),
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        //console.log("Inventory Data updated:", data);
        setInventoryData(data);
        setInventoryLow(data.itemsLowInStock);
        setPending(false);
      } else {
        //console.error("Failed to fetch inventory data");
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

  const labelSyle = "block text-white text-lg font-bold mb-2";

  const defaultColumns = [
    {
      name: "Medication",
      selector: (row) => row.medicationInfo.name,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.itemType,
      sortable: true,
    },
    {
      name: "Batch Barcode",
      selector: (row) => row.batch.barcode,
      sortable: true,
    },
    {
      name: "Expiration Date",
      selector: (row) => {
        return new Date(row.batch.expirationDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      },
      sortable: true,
    },
    {
      name: "Quantity",
      selector: (row) => row.batch.quantity,
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
  ];
  const columnsForRemoved = [
    {
      name: "Medication",
      selector: (row) => row.medicationInfo.name,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.itemType,
      sortable: true,
    },
    {
      name: "Medication Manufacturer",
      selector: (row) => row.medicationInfo.manufacturer,
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

  const columnsForLowStock = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },

    {
      name: "Item Type",
      selector: (row) => row.category,
      sortable: true,
    },
    {
      name: "Quantity",
      selector: (row) => row.quantity,
      sortable: true,
    },
    {
      name: "Last Update",
      selector: (row) => {
        return (
          <>
            {new Date(row.lastUpdate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
            <br />
            {new Date(row.lastUpdate).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </>
        );
      },
      sortable: true,
    },
  ];

  const customPendingContent = (
    <div>
      <p className={labelSyle}>Loading...</p>
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    </div>
  );

  return (
    <>
      <div className="w-1/2  md:flex  mx-3 my-3">
        <div className="w-full mx-2">
          <div className="relative mb-4 flex   flex-wrap my-5 items-stretch top-6">
            <span className="flex items-center whitespace-nowrap rounded-l  bgCor border border-r-0 border-solid border-neutral-300 px-3  text-center text-base font-normal leading-[1.6] text-white dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200">
              Start Date
            </span>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
              }}
              className={` relative m-0 block w-[1px] min-w-0 flex-auto rounded-r  bg-clip-padding py-2 px-2  text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary`}
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
        </div>
        <div className="w-full mx-4">
          <div className="relative mb-4 flex   flex-wrap my-5 items-stretch top-6">
            <span className="flex items-center whitespace-nowrap rounded-l  bgCor border border-r-0 border-solid border-neutral-300 px-3  text-center text-base font-normal leading-[1.6] text-white dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200">
              End Date
            </span>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
              }}
              className={` relative m-0 block w-[1px] min-w-0 flex-auto rounded-r  bg-clip-padding py-2 px-2  text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary`}
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
        </div>
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
              <li role="presentation" className="flex-1">
                <a
                  href="#items-lowStock"
                  className={`${
                    activeTab === "items-lowStock"
                      ? "text-primary bg-sky-100"
                      : "text-neutral-500"
                  } ${tabStyle}`}
                  data-te-toggle="pill"
                  data-te-target="#items-lowStock"
                  role="tab"
                  aria-controls="items-lowStock"
                  aria-selected={activeTab === "items-lowStock"}
                  onClick={() => handleTabClick("items-lowStock")}
                >
                  Items Low in Stock
                </a>
              </li>
            </ul>
          </div>
          <div className="mb-6 mx-5">
            <div className="px-5 text-white">
              {pending ? (
                customPendingContent
              ) : activeTab === "items-added" ? (
                <DataTable
                  title="Items Added"
                  columns={defaultColumns}
                  data={inventoryData.itemsAdded}
                  pagination
                />
              ) : activeTab === "items-removed" ? (
                <DataTable
                  title="Items Removed"
                  columns={columnsForRemoved}
                  data={inventoryData.itemsRemoved}
                  pagination
                />
              ) : null}
              <div
                className={`${
                  activeTab === "items-lowStock" ? "block" : "hide "
                } transition-opacity duration-150 ease-linear data-[te-tab-active]:block`}
                id="inventory"
                role="tabpanel"
                aria-labelledby="prescription-tab"
              >
                <DataTable
                  title="Items Low In Stock"
                  columns={columnsForLowStock}
                  data={inventoryData.itemsLowInStock}
                  pagination
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
