"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PharmacyStaffDashboard() {
  //const dashboardNames = ["Test1", "Test2", "Test3"];
  //const dashboardDsts = ["/", "/", "/"]; //TODO: Update with actual paths

  const router = useRouter();
  const blockStyle = {
    marign: "10 auto",

    padding: "20px",
    border: "0 ",
    width: "80%",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    left: "10%",
  };
  useEffect(() => {
    if (
      localStorage.getItem("role") != "cashier" &&
      localStorage.getItem("role") != "pharmacy technician"
    ) {
      router.push("/pages/");
    }
  });
  return (
    <div>
      <div style={blockStyle}>
        <Link
          className="user-button"
          href="./staffDashboard/createPatientAccount"
        >
          Create Patient Accounts{" "}
        </Link>{" "}
        <Link
          className="user-button"
          href="./staffDashboard/inputPrescriptionInfo"
        >
          Input Prescription Info{" "}
        </Link>{" "}
      </div>{" "}
    </div>
  );
}
