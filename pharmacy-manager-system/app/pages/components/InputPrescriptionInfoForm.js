"use client";




import { useState, useEffect } from "react";
export default function InputPrescriptionInfo() {
  const [inventoryItems,     setInventoryItems] = useState([]);

  const [inventoryUpdated, setInventoryUpdated]     = useState(false);
 
  useEffect(() => {
    setInventoryUpdated(!inventoryUpdated); 
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("token"); // get auth token from localStorage

    fetch("http://127.0.0.1:3030/pharmacy-0x2/api/inventory/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // include bearer token in the Autho header
      },
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Network response error');
      }
      return res.json();
    })
    .then((data) => {
      setInventoryItems(data); 
      console.log(data); 
    }) 
    .catch((error) => {
      console.error('Fetch error:', error);
    });
  }, [inventoryUpdated]);


  let selectMedication = document.getElementById("medicationID");



  for (let i = 0; i < inventoryItems.length; i++) {
    let opt = document.createElement("option");
    if (i == 0) {
      opt.value = "0";
      opt.innerHTML = "-- select an option --"
      opt.style ="display:none;"
      selectMedication.appendChild(opt);
    }
    opt.value = inventoryItems[i]._id;
    opt.innerHTML = inventoryItems[i].name;
    selectMedication.appendChild(opt);
  }

  const blockStyle = "m-5  p-5 flex flex-col justify-center items-center";
  const centerStyle = "text-center text-white";
  const inputStyle =
    "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline";
  const submitButtonStyle =
    "bg-blue-500 hover:bg-blue-700  border rounded w-full my-5 py-2  text-white appearance-none focus:outline-none focus:shadow-outline";
  const labelSyle = "block text-white text-sm font-bold mb-2";

  const initialState = {
    email: "",
    doctorName: "",
    medicationID: "",
    quantity: "",
    dosage: "",
    deliveredBy: "",
    refills: "",
    allowRefill: "",
    dueDate: ""
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
          "email": formData.email,
          "doctorName": formData.doctorName,
          "medicationID": formData.medicationID,
          "quantity": formData.quantity,
          "deliveredBy": formData.deliveredBy,
          "refillPolicy": {
            "refills": formData.refills,
            "allowRefill": formData.allowRefill,
            "dueDate": formData.dueDate
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
          <h3> Patient Email</h3>
          <hr className="mb-2" />
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
          </div>
          <h3> Prescription Info </h3>
          <hr className="mb-2" />
          <div className="w-full md:flex">
            <div className="w-full mx-2">
              <label className={labelSyle}>Doctor Name</label>
              <input
                type="text"
                placeholder="Doctor Name"
                className={inputStyle}
                id="doctorName"
                name="doctorName"
                value={formData.doctorName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="w-full mx-2">
              <label className={labelSyle}>Medication ID</label>
              <select
                className={inputStyle}
                id="medicationID"
                name="medicationID"
                value={formData.medicationID}
                onChange={handleChange}
                required
              >
                <option style={{display:"none"}}> -- select an option -- </option>
              </select>
            </div>
          </div>
          <div className="w-full md:flex">
            <div className="w-full mx-2">
              <label className={labelSyle}>Quantity</label>
              <input
                type="number"
                min="1"
                placeholder="Quantity"
                className={inputStyle}
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>
            <div className="w-full mx-2">
              <label className={labelSyle}>Dosage</label>
              <input
                type="text"
                placeholder="Dosage"
                className={inputStyle}
                id="dosage"
                name="dosage"
                value={formData.zipCode}
                onChange={handleChange}
                required
              />
            </div>
            <div className="w-full mx-2">
              <label className={labelSyle}>Delivered By</label>
              <select
                placeholder="Delivered By"
                className={inputStyle}
                id="deliveredBy"
                name="deliveredBy"
                value={formData.deliveredBy}
                onChange={handleChange}
                required
              >
                <option style={{display:"none"}}> -- select an option -- </option>
                <option value="patient">Patient</option>
                <option value="doctorsOffice">Doctor's Office</option>
              </select>
            </div>
          </div>
          <h3> Refill Policy </h3>
          <hr className="mb-2" />
          <div className="w-full flex-1 md:flex ">
            <div className="w-full mx-2">
              <label className={labelSyle}>Refills</label>
              <input
                type="number"
                min="0"
                placeholder="Refills"
                id="refills"
                name="refills"
                value={formData.refills}
                onChange={handleChange}
                className={inputStyle}
              />
            </div>
            <div className="w-full mx-2">
              <label className={labelSyle}> Allow Refill </label>
              <div style={{background:"white", border:"3px solid white", padding:"4.1px", borderRadius:"5px", display:"flex", justifyContent:"space-around"}}>
              <label for="allowRefillYes" style={{color:"gray", fontSize:"1.1em"}}>Yes</label>
              <input
                type="radio"
                id="allowRefillYes"
                name="allowRefill"
                value={formData.allowRefill}
                onChange={handleChange}
                style={{width:"2em"}}
              />
              <label for="allowRefillNo" style={{color:"gray", fontSize:"1.1em"}}>No</label>
              <input
                type="radio"
                id="allowRefillNo"
                name="allowRefill"
                value={formData.allowRefill}
                onChange={handleChange}
                style={{width:"2em"}}
              />
              <br></br>
              </div>
            </div>
            <div className="w-full mx-2">
              <label className={labelSyle}> Due Date </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
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
