import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";


export default function AuthLogs({ authLogstList, setAuthLogstList }) {
  const [pat, setPat] = useState(false);
  const [isAutho, setIsAutho] = useState(false);
  const [pending, setPending] = useState(true);

  const CustomLoader = () => (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  );
  const columns = [
    ,
    {
      name: "Staff Email",
      selector: (row) => row.staffEmail,
      sortable: true,
    },
    {
      name: "Staff Name",
      selector: (row) => row.staffName,
      sortable: true,
    },
     {
      name: "Action Performed",
      selector: (row) => row.actionType,
      sortable: true,
    },

    {
      name: "Date",
      selector: (row) => row.date,
      sortable: true,
    },
    {
      name: "Time",
      selector: (row) =>  row.time,
      sortable: true,
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://127.0.0.1:3030/pharmacy-0x2/api/auth-logs", {
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
        setAuthLogstList(data);
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
          title="Auth Logs"
          columns={columns}
          data={authLogstList}
          pagination
          progressPending={pending}
          progressComponent={<CustomLoader />}
        ></DataTable>
      </div>
    </>
  );
}
