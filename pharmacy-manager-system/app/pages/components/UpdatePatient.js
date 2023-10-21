'use client';
import {useState} from 'react';
import Swal from 'sweetalert2';
export default function UpdatePatient({setShowUpdatePatientForm, patientInfo}) {
  console.log({patientInfo});
  const inputStyle =
    'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline';
  const submitButtonStyle =
    'bg-sky-700 hover:bg-sky-600  border rounded w-full my-2 py-2  text-white appearance-none focus:outline-none focus:shadow-outline';
  const labelSyle = 'block text-gray-500 text-sm font-bold mb-2';

  const initialState = {
    email: patientInfo.email,
    phoneNumber: patientInfo.phoneNumber,
    firstName: patientInfo.firstName,
    lastName: patientInfo.lastName,
    dateOfBirth: patientInfo.dateOfBirth,
    streetName: patientInfo.address.streetName,
    city: patientInfo.address.state,
    state: patientInfo.address.state,
    zipCode: patientInfo.address.zipCode,
    policyNumber: patientInfo.insuranceInformation.policyNumber,
    provider: patientInfo.insuranceInformation.provider,
  };

  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        'http://127.0.0.1:3030/pharmacy-0x2/api/update-patient',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
         body: JSON.stringify({    
             "firstName": formData.firstName,
            "lastName":formData.lastName,
            "email": formData.email, 
            "dateOfBirth":formData.dateOfBirth,
            "phoneNumber": formData.phoneNumber,
            "insuranceInformation":{
            "provider": formData.provider,
            "policyNumber": formData.formData
            },
            "address": {
            "streetName": formData.streetName,
            "city": formData.city,
            "state": formData.state,
            "zipCode": formData.zipCode}
        }),
        }
      );

      if (response.ok) {
        setFormData(initialState);
        const responseText = await response.text();
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: JSON.parse(responseText).message,
          showConfirmButton: true,
        });
        setShowUpdatePatientForm(false);

        router.refresh();
      } else {
        const errorText = await response.text();
        alert(JSON.parse(errorText).error);
      }
    } catch (error) {
      console.error('error:', error);
    }
  };
  const handleCloseModalBtn = (e) => {
    e.preventDefault();
    setShowUpdatePatientForm(false);
  };

  return (
    <div
      id="myModal"
      className="modal p-10px fixed w-screen h-full top-0 left-0 flex items-center justify-center custom-z-pos-index overflow-auto"
    >
      <div className="modal-content border-2 border-sky-600 border-opacity-100 bg-white p-8 rounded shadow-lg relative">
        <button
          className="top-0 right-0 m-1 px-2 py-1 bg-sky-700 text-white rounded absolute"
          onClick={handleCloseModalBtn}
        >
          &times;{' '}
        </button>{' '}
        <div className="order-form-popup">
          <form
            onSubmit={handleSubmit}
            className="max-w-[800px] w-full  bg-transparent p-2 rounded"
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
            <p className="text-gray-500"> Address </p>
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
            <p className="text-gray-500"> Insurance Info </p>
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
              Update Account
            </button>
          </form>
        </div>{' '}
      </div>{' '}
    </div>
  );
}
