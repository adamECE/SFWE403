"use client";

import AccountActivateForm from "./components/AccountActivateForm";
import LandingPage from "./components/LandingPage";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "../contexts/authContext";
import { setCookie, destroyCookie } from 'nookies'
export default function MainPage() {
  const [accountState, setAccountState] = useState();
  const router = useRouter();
  const { signOut } = useContext(AuthContext);
  const blockStyle = {
    margin: "10 auto",
    border: "0 ",
    padding: "20px",
    width: "80%",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    left: "10%",
  };
  const initialRender = useRef(true);
   
  // useEffect(() => {
  //   if (localStorage.getItem("role") == null) {
  //     router.push("/");
  //   }
   
  // });

  return (
    <div>
      <div style={blockStyle}>
        {" "}
        {localStorage.getItem("isACCountActive") == "true" ? (
          <LandingPage />
        ) :
          <AccountActivateForm />
        }
      </div>{" "}
    </div>
  );
}
