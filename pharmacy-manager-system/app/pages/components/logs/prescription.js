import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";

export default function PrescriptionLogs({
  prescriptioLogList,
  setPrescriptioLogList,
}) {
  const [pat, setPat] = useState(false);
  const [pending, setPending] = useState(true);

  const CustomLoader = () => (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  );
  const columns = [
    ,
    {
      name: "Pharmacist",
      selector: (row) => {
        const name = row.pharmacistName;
        return (
          <>
            {" "}
            {name} <br /> {row.pharmacistEmail}{" "}
          </>
        );
      },
      sortable: true,
    },
    {
      name: "Patient",
      selector: (row) => {
        return (
          <>
            {" "}
            {row.patientName} <br /> {row.patientEmail}{" "}
          </>
        );
      },
      sortable: true,
    },
    {
      name: "PrescriptionID",
      selector: (row) => row.prescriptionID,
      sortable: true,
    },
    {
      name: "Quantity",
      selector: (row) => row.quantity,
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(
      "http://127.0.0.1:3030/pharmacy-0x2/api/patientHistory/prescription-logs",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response error");
        }
        return res.json();
      })
      .then((data) => {
        setPrescriptioLogList(data);
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
          title="Prescription Filled Logs"
          columns={columns}
          data={prescriptioLogList}
          pagination
          progressPending={pending}
          progressComponent={<CustomLoader />}
        ></DataTable>{" "}
      </div>{" "}
    </>
  );
}
