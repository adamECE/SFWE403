"use client";
import { useEffect, useState } from "react";
import PrescriptionRow from "./PrescriptionRow";
import PopupPrescriptionItemWindow from "./PopupPrescriptionWindow";

export default function Prescription() {
  const [prescriptionItems, setPrescriptionItems] = useState([]);
  const [popupWindow, setPopupWindow] = useState(false);
  const [selectedPatient, setPatient] = useState([]);
  const [popupWindowContent, setPopupWindowContent] = useState({});
  const [prescriptionUpdated, setPrescriptionUpdated] = useState(false);
  const [findUser, setFindUser] = useState(false);
  const [item, setItem] = useState({});
  const submitButtonStyle =
    "z-[4] bgCor inline-block rounded-r bg-cyan-100 px-6 pb-2 pt-2.5  font-medium uppercase leading-normal text-white focus:outline-none focus:shadow-outline";

  const inputStyle =
    "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline";
  const labelStyle = "block text-white text-sm font-bold mb-2";
  const initialState = {
    userEmail: "",
  };
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // get auth token from localStorage

    try {
      // First API call
      const getPatStr =
        "http://127.0.0.1:3030/pharmacy-0x2/api/a-patient/" +
        formData.userEmail;
      const response = await fetch(getPatStr, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setFindUser(!findUser);
        alert(" User not found");
        return;
      }

      const patientData = await response.json();
      setPatient(patientData);
      setFindUser(!findUser);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token"); // get auth token from localStorage

    fetch(
      "http://127.0.0.1:3030/pharmacy-0x2/api/patientHistory/get-patient-prescription-info",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: selectedPatient._id,
        }),
      }
    )
      .then((res) => {
        if (!res.ok) {
          setPrescriptionUpdated(!prescriptionUpdated);
          throw new Error("Network response error");
        }
        return res.json();
      })
      .then((data) => {
        setPrescriptionItems(data);
        setPrescriptionUpdated(!prescriptionUpdated);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }, [findUser]);

  const thStyle = " px-6 py-4";
  const blockStyle = "m-5 p-5 flex flex-col justify-center items-center ";
  return (
    <div className={blockStyle}>
      <h3> Fill Patient Prescription</h3>
      <form
        onSubmit={handleCheckSubmit}
        className="max-w-[800px] w-full mx-auto bg-transparent p-4 rounded border border-blue-500"
      >
        <noscript>
          <input type="submit" />
        </noscript>{" "}
        <hr className="mb-2" />
        <div className="w-full  md:flex flex-1">
          <div className="w-full mx-2">
            <label className={labelStyle}> Enter Patient Email </label>{" "}
            <input
              type="text"
              placeholder="User Email"
              className={inputStyle}
              id="userEmail"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleChange}
              required
            />
          </div>{" "}
        </div>{" "}
      </form>{" "}
      {findUser ? (
        <>
          {" "}
          <h3> Prescriptions </h3>
          {popupWindow && (
            <PopupPrescriptionItemWindow
              popupWindowContent={popupWindowContent}
              setPopupWindow={setPopupWindow}
              setItem={setItem}
              item={item}
            />
          )}{" "}
          <table className="border-collapse border border-sky-700 md:table-fixed font-light mx-4 my-4">
            <thead className="border-b bg-neutral-50 font-medium dark:border-neutral-500 dark:text-neutral-800">
              <tr>
                <th scope="col" className={thStyle}>
                  Medication{" "}
                </th>{" "}
                <th scope="col" className={thStyle}>
                  Delivered By{" "}
                </th>{" "}
                <th scope="col" className={thStyle}>
                  Doctor Name{" "}
                </th>{" "}
                <th scope="col" className={thStyle}>
                  Dosage{" "}
                </th>{" "}
                <th scope="col" className={thStyle}>
                  Refill Due Date{" "}
                </th>
                <th scope="col" className={thStyle}>
                  Refills Left
                </th>
                <th scope="col" className={thStyle}>
                  isValid
                </th>
              </tr>
            </thead>
            <tbody>
              {prescriptionItems.map((item) => (
                <PrescriptionRow
                  key={item._id}
                  _id={item._id}
                  popupWindow={popupWindow}
                  setPopupWindow={setPopupWindow}
                  setPopupWindowContent={setPopupWindowContent}
                  deliveredBy={item.deliveredBy}
                  doctorName={item.doctorName}
                  dosage={item.dosage}
                  medicationID={item.medicationInfo._id}
                  isValid={item.isValid}
                  quantity={item.quantity}
                  price={item.medicationInfo.price}
                  medicationName={item.medicationInfo.name}
                  medicationDescription={item.medicationInfo.description}
                  medicationManufacturer={item.medicationInfo.manufacturer}
                  filledInfo={item.filledInfo}
                  refillPolicy={item.refillPolicy.allowRefill}
                  refillDueDate={item.refillPolicy.dueDate}
                  refills={item.refillPolicy.refills}
                  patient={selectedPatient}
                />
              ))}{" "}
            </tbody>{" "}
          </table>{" "}
        </>
      ) : (
        ""
      )}
    </div>
  );
}
