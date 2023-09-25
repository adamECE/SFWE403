import '@/app/globals.css'
import Link from "next/link";

export default function CreateAccount() {
  const blockStyle = {
    margin: '10 auto', 
    border:'solid 2px black',
    padding: '20px',
    backgroundColor: '#86BBD8', 
    width: '80%',
    justifyContent: 'space-between',
    alignItems:'center',
    position: 'absolute', 
    display:'flex', 
    flexDirection:'column',
    left:'10%',
  }
  const centerStyle = {
    textAlign: 'center'
  }

    return (
      <div>
        <h1>Create Account</h1>
        <h2 style={centerStyle}> What kind of account do you want to make?</h2>
        <div style={blockStyle}>
              <Link className= 'user-button' href='/dashboards/managerDashboard/createAccount/createUserAccount'>User</Link>
              <Link className= 'user-button' href='/dashboards/managerDashboard/createAccount/createPatientAccount'>Patient</Link>
        </div>
      </div>
    )
  }
  