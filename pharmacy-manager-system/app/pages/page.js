"use client";

import AccountActivateForm from './components/AccountActivateForm'
import LandingPage  from './components/LandingPage'
export default function MainPage() {
  
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
  
  return (
    <div>
      <div style={blockStyle}>
        { localStorage.getItem("isACCountActive")=="true" ?<LandingPage/>:<AccountActivateForm/>}
       
      </div>{" "}
    </div>
  );
}
