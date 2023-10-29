import { useState, useEffect } from "react";

import DataTable, { ExpanderComponentProps } from "react-data-table-component";
import LinearProgress from "@mui/material/LinearProgress";

import Box from "@mui/material/Box";
export default function InventoryLogs({ patientList, setPatientList }) {
  const [pat, setPat] = useState(false);
  const [isAutho, setIsAutho] = useState(false);
  const [pending, setPending] = useState(true);
  const inputStyle =
    "shadow appearance-none border rounded text-sm  w-full py-2 px-2 text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline";

  const labelSyle = "block text-gray-500 text-sm font-bold mb-2";
  const CustomLoader = () => (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  );
  const columns = [
    ,
    {
      name: "Staff",
      selector: (row) => {
        return (
          <>
            {row.staffName} <br /> {row.staffEmail}
          </>
        );
      },
      sortable: true,
    },
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
      name: "Action Performed",
      selector: (row) => ` batch ${row.actionType}`,
      sortable: true,
    },

    {
      name: "Date",
      selector: (row) => {
        return (
          <>
            {row.date} <br /> {row.time}
          </>
        );
      },
    },
  ];

  const ExpandedComponent = ({ data }) => (
    <div>
      <div className="w-full md:flex">
        <div className="w-auto my-2 flex-1 mx-3">
          <div className=" md:flex">
            <div className="w-auto mx-2 flex-1">
              <label className={labelSyle}>Batch Information</label> <hr />
              <p className={inputStyle}>
                Barcode: {data.batch.barcode}
                <br />
                Expiration Date: {new Date(data.batch.expirationDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            })}
                <br />
                Quantity: {data.batch.quantity}
              </p>
            </div>
            <div className="w-auto mx-2 flex-1">
              <label className={labelSyle}>Medication Details</label> <hr />
              <p className={inputStyle}>
                <span  className="mx-3">Name: {data.medicationInfo.name}</span>
                <br />
                <span  className="mx-3">Description: {data.medicationInfo.description}</span>
               <br />
                <span  className="mx-3">Manufactor: {data.medicationInfo.manufacturer}</span> 
              
                <span  className="mx-3"> Price: {data.medicationInfo.price}</span>
              
                <span  className="mx-3">Location: {data.medicationInfo.location}</span> 
              </p>
            </div>
          </div>

          <hr />
        </div>
      </div>
      <hr /> <hr />
    </div>
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://127.0.0.1:3030/pharmacy-0x2/api/inventory/logs", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response error");
        }
        return res.json();
      })
      .then((data) => {
        setPatientList(data);
        console.log(pat);
        setPat(true);
        setPending(false);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }, [pat]);

  return (
    <>
      <div className=" px-5 text-white">
        <DataTable
          title="Inventory Logs"
          columns={columns}
          data={patientList}
          pagination
          expandableRows
          expandableRowsComponent={ExpandedComponent}
          progressPending={pending}
          progressComponent={<CustomLoader />}
        ></DataTable>{" "}
      </div>{" "}
    </>
  );
}
