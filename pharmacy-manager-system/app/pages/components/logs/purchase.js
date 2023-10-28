import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";

export default function PurchaseLogs({
  purchaseLogList,
  setPurchaseLogList,
}) {
  const [pat, setPat] = useState(false);
  const [pending, setPending] = useState(true);

  const CustomLoader = () => (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  );
  const columns = [];


  return (
    <>
      <div className=" px-5 text-white">
       to be completed after purchase is implemented
      </div>
    </>
  );
}
