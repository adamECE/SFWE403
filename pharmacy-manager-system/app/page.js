"use client";

import React, { useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from './contexts/authContext';
import { useRouter } from "next/navigation";
import { setCookie, parseCookies } from 'nookies'

export default function Login() {
  const router = useRouter();
  
  const { signIn,isAuthenticated ,user} = useContext(AuthContext)

  const initialState = {
    email: "",
   password:""
  };
  const [formData, setFormData] = useState(initialState);

 const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await signIn({ email:formData.email,password: formData.password })};
  console.log({"in login": user })
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full resetLogin">
      <div className="hidden sm:block">
        <img
          className="w-full h-full object-cover"
          src="logo1.jpeg"
          alt="pharmacist and a patient"
        />
      </div>{" "}
      <div className=" flex flex-col justify-center">
        <form onSubmit={handleSubmit} className="max-w-[400px] w-full mx-auto bg-transparent p-4 rounded border border-sky-400">
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">
              Email{" "}
            </label>{" "}
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              value={formData.email}
                onChange={handleChange}
              name="email"
              placeholder="insert email"
            />
          </div>{" "}
          <div className="mb-6">
            <label className="block text-white text-sm font-bold mb-2">
              Password{" "}
            </label>{" "}
            <input
              className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
               value={formData.password}
                onChange={handleChange}
              name="password"
              placeholder="insert password"
            />
            <button
              className=" bg-blue-500 hover:bg-blue-700   rounded w-full my-5 py-2  text-white appearance-none
        focus:outline-none focus:shadow-outline "
              type="submit"
            >
              Sign In{" "}
            </button>{" "}
          </div>{" "}
          <div className="flex items-center justify-between">
            <a
              className="inline-block align-baseline text-white font-bold text-sm text-blue-500 hover:text-blue-800"
              href="#"
            >
              Forgot Password ?
            </a>{" "}
          </div>{" "}
        </form>{" "}
      </div>{" "}
    </div>
  );
}
