"use client";


import { useState, useEffect } from "react";
export default function InputPrescriptionInfo() {
  const blockStyle = "m-5  p-5 flex flex-col justify-center items-center";
  const centerStyle = "text-center text-white";
  const inputStyle =
    "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline";
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
    policyNumber: "",
    provider: "",
  };
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      // Make a POST request to your login endpoint
      const response = await fetch('http://127.0.0.1:3030/pharmacy-0x2/api/new-patient', { // TODO
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include the bearer token in the Authorization header
          'Authorization': `Bearer ${token}`,
        },

        body: JSON.stringify({
          "firstName": formData.firstName,
          "lastName": formData.lastName,
          "email": formData.email,
          "dateOfBirth": formData.dateOfBirth,
          "phoneNumber": formData.phoneNumber,
          "insuranceInformation": {
            "provider": formData.provider,
            "policyNumber": formData.formData
          },
          "address": {
            "streetName": formData.streetName,
            "city": formData.city,
            "state": formData.state,
            "zipCode": formData.zipCode
          }
        }),
      });

      if (response.ok) {
        setFormData(initialState);
        const responseText = await await response.text();
        alert(JSON.parse(responseText).message)
      } else {
        setFormData(initialState);
        const errorText = await response.text();
        alert(JSON.parse(errorText).error);
      }
    } catch (error) {
      console.error('error:', error);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('isACCountActive')) {
      router.push("/pages/");
    }
  })

  return (
    <div>
      <h2 className={centerStyle}>Input Prescription Info</h2>
      <div className={blockStyle}>
        <form
          onSubmit={handleSubmit}
          className="max-w-[800px] w-full mx-auto bg-transparent p-4 rounded border border-blue-500"
        >
          <h3> General Info</h3>
          <hr className="mb-2" />
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
          </div>
          <h3> Address </h3>
          <hr className="mb-2" />
          <div className="w-full md:flex">
            <div className="w-full mx-2">
              <label className={labelSyle}>Address Line 1</label>
              <input
                type="text"
                placeholder="Address Line "
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
              <label className={labelSyle}>State</label>
              <input
                type="text"
                placeholder="State"
                className={inputStyle}
                id="state"
                name="state"
                value={formData.state}
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
          <h3> Insurance Info </h3>
          <hr className="mb-2" />
          <div className="w-full flex-1 md:flex ">
            <div className="w-full mx-2">
              <label className={labelSyle}>Provider</label>
              <input
                type="text"
                placeholder="Provider"
                id="provider"
                name="provider"
                value={formData.provider}
                onChange={handleChange}
                className={inputStyle}
              />
            </div>
            <div className="w-full mx-2">
              <label className={labelSyle}>Policy Number</label>
              <input
                type="text"
                placeholder="Policy Number"
                id="policyNumber"
                name="policyNumber"
                value={formData.policyNumber}
                onChange={handleChange}
                className={inputStyle}
              />
            </div>
          </div>

          <button className={submitButtonStyle} type="submit">
            Submit Prescription
          </button>
        </form>
      </div>
    </div>
  );
}
