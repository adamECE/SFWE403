"use client";

import Link from "next/link";
import { useState } from "react";

export default function CreateAccount() {
  const [role, setRole] = useState("");

  const blockStyle = "m-5  p-5 flex flex-col justify-center items-center";
  const centerStyle = "text-center text-white";
  const inputStyle =
    "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline";
  const selectStyle =
    "shadow  border mx-2 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline";
  const submitButtonStyle =
    "bg-blue-500 hover:bg-blue-700  border rounded w-full my-5 py-2  text-white appearance-none focus:outline-none focus:shadow-outline";
  const labelSyle = "block text-white text-sm font-bold mb-2";

  const initialState = {
    email: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    streetName: "",
    city: "",
    state: "",
    zipCode: "",
    role: "",
  };
  const [formData, setFormData] = useState(initialState);

  const handleSubmit = (e) => {
    e.preventDefault();
    //implement from submission to db he
    setTimeout(() => {
      alert(" account create!!");
      setFormData(initialState); // Clear form fields
    }, 1000);
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <div>
      <h2 className={centerStyle}>New User Account</h2>
      <div className={blockStyle}>
        <form
          onSubmit={handleSubmit}
          className="max-w-[800px] w-full mx-auto bg-transparent p-4 rounded border border-blue-500"
        >
          <div className="w-full  md:flex flex-1">
            <div className="w-full mx-2">
              <label className={labelSyle}>First Name</label>
              <input
                type="text"
                placeholder="First Name"
                className={inputStyle}
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="w-full mx-2">
              <label className={labelSyle}>Last Name</label>
              <input
                type="text"
                placeholder="Last Name"
                className={inputStyle}
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="w-full  md:flex flex-1">
            <div className="w-full mx-2">
              <label className={labelSyle}>Email</label>
              <input
                type="email"
                placeholder="Email"
                className={inputStyle}
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="w-full mx-2">
              <label className={labelSyle}>Phone Number</label>
              <input
                type="text"
                placeholder="Phone Number"
                className={inputStyle}
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="w-full md:flex">
            <div className="w-full mx-2">
              <label className={labelSyle}>Address Line 1</label>
              <input
                type="text"
                placeholder="Address Line 1"
                className={inputStyle}
                id="streetName"
                name="streetName"
                value={formData.streetName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="w-full mx-2">
              <label className={labelSyle}>City</label>
              <input
                type="text"
                placeholder="City"
                className={inputStyle}
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="w-full md:flex">
            <div className="w-full mx-2">
              <label className={labelSyle}>Style</label>
              <input
                type="text"
                placeholder="State"
                className={inputStyle}
                id="state"
                name="state"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className="w-full mx-2">
              <label className={labelSyle}>Zip</label>
              <input
                type="text"
                placeholder="Zip Code"
                className={inputStyle}
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="w-full flex-1 md:flex ">
            <div className="w-full mx-2">
              <label className={labelSyle}>Date of Birth</label>
              <input
                type="date"
                placeholder="Date of Birth"
                className={`${inputStyle} date-form`}
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>
            <div className="w-full mx-2">
              <label className={labelSyle}>Role</label>
              <select
                className={selectStyle}
                id="role"
                name="role"
                value={role}
                onChange={handleRoleChange}
                required
              >
                <option value="">Select Role</option>
                <option value="pharmacy manager">Pharmacy Manager</option>
                <option value="pharmacist">Pharmacist</option>
                <option value="pharmacy technician">Pharmacy Technician</option>
                <option value="cashier">Cashier</option>
              </select>
            </div>
          </div>
          <button className={submitButtonStyle} type="submit">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
