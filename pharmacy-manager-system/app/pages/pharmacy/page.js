"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
export default function PatientAccountForm() {
  const router = useRouter();

  const blockStyle = "m-5  p-5 flex flex-col justify-center items-center";
  const centerStyle = "text-center text-white";
  const inputStyle =
    "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline";
  const submitButtonStyle =
    "bgCor hover:bg-cyan-600  border rounded w-full my-5 py-2  text-white appearance-none focus:outline-none focus:shadow-outline";
  const editButtonStyle =
    "bgCor hover:bg-cyan-600  border rounded w-20  my-5 py-2  text-white appearance-none focus:outline-none focus:shadow-outline";

  const labelSyle = "block text-white text-sm font-bold mb-2";

  const [editMode, setEditMode] = useState(false); // Initialize edit mode as false
  const [formData, setFormData] = useState();
  const [pharmacyInfo, setPharmacyInfo] = useState();
  const [userRole, setUserRole] = useState();

  const handleChange = (e) => {
    setPharmacyInfo({ ...pharmacyInfo, [e.target.name]: e.target.value });
  };

  const handleWorkingHoursChange = (dayIndex, field, value) => {
    const updatedWorkingHours = [...pharmacyInfo.workingHours];
    updatedWorkingHours[dayIndex][field] = value;
    setPharmacyInfo({
      ...pharmacyInfo,
      workingHours: updatedWorkingHours,
    });
  };

  const handleAddressChange = (field, value) => {
    const updatedAddress = pharmacyInfo.address;
    updatedAddress[field] = value;
    setPharmacyInfo({
      ...pharmacyInfo,
      address: updatedAddress,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      // Make a POST request to your login endpoint
      const response = await fetch(
        "http://127.0.0.1:3030/pharmacy-0x2/api/pharmacy/update-info",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // Include the bearer token in the Authorization header
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            _id: pharmacyInfo._id,
            name: pharmacyInfo.name,
            website: pharmacyInfo.website,
            address: pharmacyInfo.address,
            owner: pharmacyInfo.owner,
            phoneNumber: pharmacyInfo.phoneNumber,
            workingHours: pharmacyInfo.workingHours,
          }),
        }
      );

      if (response.ok) {
        setPharmacyInfo(pharmacyInfo);
        setFormData(pharmacyInfo);
        const responseText = await response.text();
        //alert(JSON.parse(responseText).message)
        Swal.fire(`${JSON.parse(responseText).message}`, "", "success");
        router.refresh();
      } else {
        setPharmacyInfo(pharmacyInfo);
        setFormData(pharmacyInfo);
        const errorText = await response.text();
        //alert(JSON.parse(errorText).error);
        Swal.fire(`${JSON.parse(errorText).error}`, "", "error");
        router.refresh();
      }
    } catch (error) {
      console.error("error:", error);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("isACCountActive")) {
      router.push("/pages/");
    }
  });

  useEffect(() => {
    const token = localStorage.getItem("token"); // get auth token from localStorage
    setUserRole(localStorage.getItem("role"));
    fetch("http://127.0.0.1:3030/pharmacy-0x2/api/pharmacy/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // include bearer token in the Autho header
      },
    })
      .then((res) => {
        if (!res.ok) {
          //alert('somenthing went wrong');
          Swal.fire(`Somenthing went wrong`, "", "error");
        }
        return res.json();
      })
      .then((data) => {
        setPharmacyInfo(data[0]);
        setFormData(data[0]);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }, []);

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setPharmacyInfo(formData);
    router.refresh();
  };
  return (
    <div>
      <h2 className={centerStyle}> Pharmacy General Information </h2>{" "}
      <div className={blockStyle}>
        {" "}
        {pharmacyInfo ? (
          <form
            onSubmit={handleSubmit}
            className="max-w-[800px] w-full mx-auto bg-transparent p-4 rounded border border-blue-500"
          >
            <h3> General Info </h3> <hr className="mb-2" />
            <div className="w-full  md:flex flex-1">
              <div className="w-full mx-2">
                <label className={labelSyle}> Name </label>{" "}
                <input
                  type="text"
                  placeholder="name"
                  className={inputStyle}
                  id="name"
                  name="name"
                  value={pharmacyInfo.name}
                  onChange={handleChange}
                  disabled={!editMode}
                  required={editMode}
                />{" "}
              </div>{" "}
              <div className="w-full mx-2">
                <label className={labelSyle}> Owner </label>{" "}
                <input
                  type="text"
                  placeholder="owner"
                  className={`${inputStyle} date-form`}
                  id="owner"
                  name="owner"
                  value={pharmacyInfo.owner}
                  onChange={handleChange}
                  disabled={!editMode}
                  required={editMode}
                />{" "}
              </div>{" "}
            </div>{" "}
            <div className="w-full  md:flex flex-1">
              <div className="w-full mx-2">
                <label className={labelSyle}> Phone Number </label>{" "}
                <input
                  type="text"
                  placeholder="Phone Number"
                  className={inputStyle}
                  id="phoneNumber"
                  name="phoneNumber"
                  value={pharmacyInfo.phoneNumber}
                  onChange={handleChange}
                  disabled={!editMode}
                  required={editMode}
                />{" "}
              </div>{" "}
              <div className="w-full mx-2">
                <label className={labelSyle}> Website </label>{" "}
                <input
                  type="text"
                  placeholder="website"
                  className={inputStyle}
                  id="website"
                  name="website"
                  value={pharmacyInfo.website}
                  onChange={handleChange}
                  disabled={!editMode}
                  required={editMode}
                />{" "}
              </div>
            </div>{" "}
            <h3> Address </h3> <hr className="mb-2" />
            <div className="w-full md:flex">
              <div className="w-full mx-2">
                <label className={labelSyle}> Address Line 1 </label>{" "}
                <input
                  type="text"
                  placeholder="Address Line "
                  className={inputStyle}
                  id="streetName"
                  name="streetName"
                  value={pharmacyInfo.address.streetName}
                  onChange={(e) =>
                    handleAddressChange("streetName", e.target.value)
                  }
                  disabled={!editMode}
                  required={editMode}
                />{" "}
              </div>{" "}
              <div className="w-full mx-2">
                <label className={labelSyle}> City </label>{" "}
                <input
                  type="text"
                  placeholder="City"
                  className={inputStyle}
                  id="city"
                  name="city"
                  value={pharmacyInfo.address.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                  disabled={!editMode}
                  required={editMode}
                />{" "}
              </div>{" "}
            </div>{" "}
            <div className="w-full md:flex">
              <div className="w-full mx-2">
                <label className={labelSyle}> State </label>{" "}
                <input
                  type="text"
                  placeholder="State"
                  className={inputStyle}
                  id="state"
                  name="state"
                  value={pharmacyInfo.address.state}
                  onChange={(e) => handleAddressChange("state", e.target.value)}
                  disabled={!editMode}
                  required={editMode}
                />{" "}
              </div>{" "}
              <div className="w-full mx-2">
                <label className={labelSyle}> Zip </label>{" "}
                <input
                  type="text"
                  placeholder="Zip Code"
                  className={inputStyle}
                  id="zipCode"
                  name="zipCode"
                  value={pharmacyInfo.address.zipCode}
                  onChange={(e) =>
                    handleAddressChange("zipCode", e.target.value)
                  }
                  disabled={!editMode}
                  required={editMode}
                />{" "}
              </div>{" "}
            </div>{" "}
            <h3> Working Hours </h3> <hr className="mb-2" />
            <div className="w-full flex-1 md:flex">
              {" "}
              {pharmacyInfo.workingHours.map((day, index) => (
                <div key={index} className="w-full mx-2">
                  <label className={labelSyle}> {day.day} </label>{" "}
                  <input
                    type="text"
                    className={inputStyle}
                    id={`openingTime-${index}`}
                    name={`openingTime-${index}`}
                    value={day.openingTime}
                    onChange={(e) =>
                      handleWorkingHoursChange(
                        index,
                        "openingTime",
                        e.target.value
                      )
                    }
                    disabled={!editMode}
                    required={editMode}
                  />{" "}
                  <input
                    type="text"
                    className={inputStyle}
                    id={`closingTime-${index}`}
                    name={`closingTime-${index}`}
                    value={day.closingTime}
                    onChange={(e) =>
                      handleWorkingHoursChange(
                        index,
                        "closingTime",
                        e.target.value
                      )
                    }
                    disabled={!editMode}
                    required={editMode}
                  />{" "}
                </div>
              ))}{" "}
            </div>{" "}
            <div className="w-full flex-1 md:flex "></div>{" "}
            {editMode ? (
              <button className={submitButtonStyle} type="submit">
                Save Changes{" "}
              </button>
            ) : (
              ""
            )}{" "}
            {userRole == "pharmacy manager" ? (
              <button
                type="button"
                onClick={toggleEditMode}
                className={editButtonStyle}
              >
                {editMode ? "Close" : "Edit"} {/* Toggle Edit or Cancel */}{" "}
              </button>
            ) : (
              ""
            )}
          </form>
        ) : (
          ""
        )}
      </div>{" "}
    </div>
  );
}
