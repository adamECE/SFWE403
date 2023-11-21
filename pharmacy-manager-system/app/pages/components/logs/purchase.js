import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";

export default function PurchaseLogs({ purchaseLogList, setPurchaseLogList }) {
  const [pat, setPat] = useState(false);
  const [pending, setPending] = useState(true);

  const CustomLoader = () => (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  );
  const columns = [
    {
      name: "Staff Email",
      selector: (row) => row.staffEmail,
      sortable: true,
    },
    {
      name: "Patient Email",
      selector: (row) => row.clientEmail,
      sortable: true,
    },

    {
      name: "Total Amount",
      selector: (row) => row.totalAmount,
      sortable: true,
    },

    {
      name: "Receipt ID",
      selector: (row) => row.receiptID,
      sortable: true,
    },

    {
      name: "Date",
      selector: (row) => {
        return (
          <>
            {" "}
            {new Date(row.timestamp).toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}{" "}
            <br />{" "}
            {new Date(row.timestamp).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}{" "}
          </>
        );
      },
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://127.0.0.1:3030/pharmacy-0x2/api/purchase/logs", {
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
        setPurchaseLogList(data);
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
          title="Purchase Logs"
          columns={columns}
          data={purchaseLogList}
          pagination
          progressPending={pending}
          progressComponent={<CustomLoader />}
        ></DataTable>{" "}
      </div>{" "}
    </>
  );
}
