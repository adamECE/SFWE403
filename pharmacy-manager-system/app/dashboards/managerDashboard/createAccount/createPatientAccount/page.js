import CreateAccButton from '@/app/functions';'@/app/functions.js'
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
  const sideBySide = {
    float: "left",
    display: "flex"
  }
    return (
      <div>
        <h2 style={centerStyle}> Create a Patient Account</h2>
        <div style={blockStyle}>
            <h3>General Information</h3>
            <form>
              <input type="email" placeholder="Email" className="input-form"/>
              <input type="text" placeholder="Phone Number" className="input-form"/>
              <input type="text" placeholder="First Name" className="input-form"/>
              <input type="text" placeholder="Last Name" className="input-form"/>
              <input type="date" placeholder="Date of Birth" className="input-form date-form"/>
              <h3>Address</h3>
              <input type="text" placeholder="Address Line 1" className="input-form"/>
              <div style={sideBySide}>
                <input type="text" placeholder="City" className="input-form" style= {sideBySide}/>
                <input type="text" placeholder="State" className="input-form" style= {sideBySide}/>
                <input type="text" placeholder="Zip Code" className="input-form" style= {sideBySide}/>
              </div>
              <h3>Insurance Information</h3>
              <div style={sideBySide}>
                <input type="text" placeholder="Provider" className="input-form" style= {sideBySide}/>
                <input type="text" placeholder="Policy Number" className="input-form" style= {sideBySide}/>
              </div>
              <CreateAccButton name="Create Account" dst="/"/>
          </form>
        </div>
      </div>
    )
}
  