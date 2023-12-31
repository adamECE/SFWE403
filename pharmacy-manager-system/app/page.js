"use client"
import React, { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "./contexts/authContext";
import { useRouter } from "next/navigation";


export default function Login() {
  const [showPassword, setShowPassword] = useState(true); // Initially show the password field
  const [email, setEmail] = useState(""); // stores the entered email
  const [code, setCode] = useState("");
  const [userCode, setUserCode] = useState("");
  const [userData, setUserData] = useState({});
  const [pswd, setPswd] = useState("");
  const { signIn, sendResetEmail, sendTwoFactorEmail,checkTwoFactorCode } = useContext(AuthContext);
  const router = useRouter();
  const [twoFactor, setTwoFactor] = useState(false);

  const handleForgotPasswordClick = () => {
    setShowPassword(!showPassword);
   
  };
  const handleReset = async (e) => {
    setUserCode("")
    setCode("")
    setEmail("")
    setShowPassword(true)
    setTwoFactor(false)
    setPswd("")
  }
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      if (showPassword) {
        const firstStep = await signIn({ email: email, password: pswd});
        // Login
        if (firstStep) {//if user email and passwird are correct
          setTwoFactor(true);
          setUserData(firstStep)
        await sendTwoFactorEmail({ email })//send the email for second step
        }
        
      } else {
        // Reset Password
        const resp = await sendResetEmail({ email }) 
        alert(resp);
        setShowPassword(!showPassword)
        setEmail("")
        setPswd("")
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleTwoFactorSubmit = async (e) => {
    e.preventDefault();
    try {
      if (twoFactor) {
        // 
      await checkTwoFactorCode({ data: userData, code: userCode })
          
      } else {
        setTwoFactor(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
 const handlePasswordChange = (e) => {
    setPswd(e.target.value);
  };

  const handleTwoFactorChange = (e) => {
    setUserCode(e.target.value);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full resetLogin">
      <div className="hidden sm:block">
        <img
          className="w-full h-full object-cover"
          src="logo1.jpeg"
          alt="pharmacist and a patient"
        />
      </div>{" "}
      <div className="flex flex-col justify-center">
      {!twoFactor && (
        <form
          onSubmit={handleEmailSubmit}
          className="max-w-[400px] w-full mx-auto bg-transparent p-4 rounded border border-sky-400"
        >
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              name="email"
              type="email"
              placeholder="Insert email"
              required
              value={email} // Bind the email value to the state
              onChange={handleEmailChange} // Update the email state
            />
          </div>
          {showPassword ? (
            <div className="mb-6">
              <label className="block text-white text-sm font-bold mb-2">
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                name="password"
                type="password"
                  placeholder="Insert password"
                  onChange={ handlePasswordChange}
              />
              <button
                className="bg-blue-500 hover:bg-blue-700 rounded w-full my-2 py-2 text-white appearance-none focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Sign In
              </button>
            </div>
          ) : (
            <button
              className="bg-blue-500 hover:bg-blue-700 rounded w-full my-2 py-2 text-white appearance-none focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Submit
            </button>
          )}
          <div className="flex items-center justify-between">
            <a
              className="inline-block align-baseline text-white font-bold text-sm text-blue-500 hover:text-blue-800"
              href="#"
              onClick={handleForgotPasswordClick}
            >
              {showPassword ? "Forgot Password?" : "Cancel"}
            </a>{" "}
          </div>{" "}
        </form>
      )}
        {twoFactor && (
        <form
          onSubmit={handleTwoFactorSubmit}
          className="max-w-[400px] w-full mx-auto bg-transparent p-4 rounded border border-sky-400"
        >
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">
              2-Factor Code
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="two-factor"
              name="two-factor"
              type="text"
              placeholder="Insert Code"
              required
              value={userCode} // Bind the email value to the state
              onChange={handleTwoFactorChange} // Update the email state
            />
            <button
                className="bg-blue-500 hover:bg-blue-700 rounded w-full my-2 py-2 text-white appearance-none focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Submit
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 rounded w-full my-2 py-2 text-white appearance-none focus:outline-none focus:shadow-outline"
                type="button"
                onClick={handleReset}
              >
              Reset
              </button>
          </div>
        </form>
        )}
      </div>{" "}
    </div>
  );
}