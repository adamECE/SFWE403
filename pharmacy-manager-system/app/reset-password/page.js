"use client"
import React, { useState,useContext } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from 'next/navigation'
import { AuthContext } from "../contexts/authContext";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const {  resetPassword} = useContext(AuthContext);
  const router = useRouter();
  const searchParams = useSearchParams()
 
  
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    const token = searchParams.get('token')
      try {
        const response = await  resetPassword({newPassword:password, confirmPassword,token });
        alert(response)
        // Redirect back to the login page
        router.push("/#"); // Replace with the actual route for the login page
    } catch (error) {
      console.error('Error:', error) }
   
    
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full resetLogin">
      <div className="hidden sm:block">
        <img
          className="w-full h-full object-cover"
          src="logo1.jpeg"
          alt="pharmacist and a patient"
        />
      </div>
      <div className="flex flex-col justify-center">
        <form
          onSubmit={handleSubmit}
          className="max-w-[400px] w-full mx-auto bg-transparent p-4 rounded border border-sky-400"
        >
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 rounded w-full my-2 py-2 text-white appearance-none focus:outline-none focus:shadow-outline"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

