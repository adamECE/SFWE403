"use client";
import { useRouter} from "next/navigation";
import AccountActivateForm from './components/AccountActivateForm'
import LandingPage  from './components/LandingPage'

export default function MainPage() {
  const router = useRouter();

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
        { localStorage.getItem('isACCountActive')=="true" ?<LandingPage/>:<AccountActivateForm/>}
       
      </div>{" "}
    </div>
  );
}
