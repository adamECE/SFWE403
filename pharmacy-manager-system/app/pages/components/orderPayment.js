"use client";
import { useState, useEffect } from "react";
import { Margin, usePDF } from "react-to-pdf";
import { useRouter, useSearchParams } from "next/navigation";
import ReceiptRow from "./ReceiptRow";
import Swal from "sweetalert2";
import Modal from "react-modal";
export default function OrderPayment() {
  const [pharmacyInfo, setPharmacyInfo] = useState();
  const [paid, setPaid] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(""); // Default to cash
  const [recieptData, setRecieptData] = useState({}); // Default to cash
  const [foundData, setFoundData] = useState(false); // Default to cash
  const [User, setUser] = useState({});
  const [findUser, setFindUser] = useState(false);
  const blockStyle = "m-5  p-5 flex flex-col justify-center items-center";
  const centerStyle = "text-center text-white";
  const inputStyle =
    "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline";
  const selectStyle =
    "shadow  border mx-2 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline";
  const submitButtonStyle =
    "bg-blue-500 hover:bg-blue-700  border rounded w-full my-5 py-2  text-white appearance-none focus:outline-none focus:shadow-outline";
  const labelSyle = "block text-white text-sm font-bold mb-2";
  const labelStyle = "block text-white text-sm font-bold mb-2";
  const labelChoices = "block text-white text-sm font-bold mb-2";
  const thStyle = " px-6 py-4";
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };
  const searchParams = useSearchParams();
  const [recID, setReceiptID] = useState("");
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
    amount: "",
  };
  const [formData, setFormData] = useState(initialState);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = async () => {
    setModalIsOpen(true);
    await getPatient(recieptData.soldTo);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      // Make a POST request to your login endpoint
      const response = await fetch(
        "http://127.0.0.1:3030/pharmacy-0x2/api/purchase/pay",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Include the bearer token in the Authorization header
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            paymentMethod: paymentMethod,
            purchaseID: searchParams.get("receiptID"),
            cardInfo: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              cardNum: formData.cardNum,
              secCode: formData.secCode,
              expDate: formData.expDate,
              zipCode: formData.zipCode,
            },
          }),
        }
      );

      if (response.ok) {
        setFormData(initialState);
        const responseText = await response.text();
        //alert(JSON.parse(responseText).message);
        Swal.fire(`${JSON.parse(responseText).message}`, "", "success");
        setPaid(true);
      } else {
        if (response.status === 403) {
          setPaid(true);
        }

        setFormData(initialState);
        const errorText = await response.text();
        Swal.fire(`${JSON.parse(errorText).error}`, "", "error");
        //alert(JSON.parse(errorText).error);
      }
    } catch (error) {
      console.error("error:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token"); // get auth token from localStorage
    const receiptID = searchParams.get("receiptID");
    setReceiptID(receiptID);

    fetch(
      "http://127.0.0.1:3030/pharmacy-0x2/api/purchase/checkout-info/" +
        receiptID,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response error");
        }
        return res.json();
      })
      .then(async (data) => {
        console.log(data.purchaseData);
        setRecieptData(data.purchaseData);

        setFoundData(true);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }, [foundData]);

  useEffect(() => {
    if (!localStorage.getItem("isACCountActive")) {
      router.push("/pages/");
    }
  });

  useEffect(() => {
    const token = localStorage.getItem("token"); // get auth token from localStorage
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
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }, []);

  async function getPatient(email) {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://127.0.0.1:3030/pharmacy-0x2/api/a-patient/${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();

        setUser({
          fullName: `${data.firstName} ${data.lastName}`,
          email: email,
          userID: data._id,
          phone: data.phoneNumber,
          address: `${data.address.streetName}. ${data.address.city}, ${data.address.state} ${data.address.zipCode}`,
        });
        setFindUser(true);
      } else {
        const errorText = await response.text();
        //alert(JSON.parse(errorText).error);
      }
    } catch (error) {
      console.error("error:", error);
    }
  }

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { toPDF, targetRef } = usePDF({
    filename: `${recID}.pdf`,
    page: { margin: Margin.MEDIUM },
  });
  return (
    <div>
      <div className="mx-3 my-3">
        <h3 className="text-white py-3">
          {" "}
          <span> User Email: {foundData ? recieptData.soldTo : ""} </span>{" "}
          <br />
          <br />
          <span className="mx-3 my-3">
            Total Amount:{" "}
            {foundData
              ? new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(recieptData.totalAmount)
              : ""}{" "}
          </span>{" "}
          <hr />
          <hr />
        </h3>{" "}
      </div>{" "}
      <h3 className={centerStyle}> Payment Method </h3>{" "}
      <div className={blockStyle}>
        <div>
          <label className={labelStyle}> Select Payment Method: </label>{" "}
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="radio"
              id="cash"
              name="paymentMethod"
              value="cash"
              checked={paymentMethod === "cash"}
              onChange={handlePaymentMethodChange}
              style={{ verticalAlign: "middle", marginRight: "8px" }}
            />{" "}
            <label className={labelChoices}> Cash </label>{" "}
          </div>{" "}
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="radio"
              id="card"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === "card"}
              onChange={handlePaymentMethodChange}
              style={{ vertical: "middle", marginRight: "8px" }}
            />{" "}
            <label className={labelChoices}> Card </label>{" "}
          </div>{" "}
        </div>{" "}
        {paymentMethod === "cash" && (
          <form
            onSubmit={handleSubmit}
            className="max-w-[800px] w-full mx-auto bg-transparent p-4 rounded border border-blue-500"
          >
            <div className="w-full  md:flex flex-1">
              <div className="w-full mx-2">
                <label className={labelSyle}> Cash Amount </label>{" "}
                <input
                  type="number"
                  placeholder="$0.00"
                  className={inputStyle}
                  id="amount"
                  name="amount"
                  step="0.1"
                  value={foundData ? recieptData.totalAmount : "0.00"}
                  min={foundData ? recieptData.totalAmount : "0.00"}
                  onChange={handleChange}
                  required={!paid}
                  disabled={paid}
                />{" "}
              </div>{" "}
            </div>{" "}
            {paid ? (
              <>
                <div>
                  <button
                    onClick={openModal}
                    className={submitButtonStyle}
                    type="button"
                  >
                    View Receipt{" "}
                  </button>{" "}
                  <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Example Modal"
                    style={customStyles}
                  >
                    <button
                      className="top-0 right-0 m-1 px-2 py-1 bgCor text-white rounded absolute"
                      onClick={closeModal}
                    >
                      &times;
                    </button>
                    <div ref={targetRef}>
                      <h2 style={{ color: "black", margin: "0px 100px 5px" }}>
                        Receipt
                      </h2>{" "}
                      <div>
                        <span className="text-sm font-light">
                          {pharmacyInfo.name}
                        </span>
                        {" | "}
                        <span className="text-sm font-light">
                          {pharmacyInfo.address.streetName}.{" "}
                          {pharmacyInfo.address.city},{" "}
                          {pharmacyInfo.address.state}{" "}
                          {pharmacyInfo.address.zipCode}
                        </span>
                        {" | "}
                        <span className="text-sm font-light">
                          {pharmacyInfo.phoneNumber}
                        </span>
                        {" | "}
                        <span className="text-sm font-light">
                          {pharmacyInfo.website}
                        </span>
                      </div>
                      <br />
                      <p style={{ borderBottom: "solid", padding: "5px 5px" }}>
                        Customer Details:{" "}
                      </p>
                      <p className="text-sm font-light">
                        Name: {User.fullName}{" "}
                      </p>{" "}
                      <p className="text-sm font-light">
                        Address: {User.address}{" "}
                      </p>
                      <p className="text-sm font-light">Email: {User.email} </p>{" "}
                      <p className="text-sm font-light">Phone: {User.phone} </p>
                      <p style={{ borderBottom: "solid", padding: "5px 5px" }}>
                        Description:{" "}
                      </p>
                      <div className="w-full ">
                        {foundData && (
                          <>
                            <div className=" flex bg-neutral-50 font-medium  dark:text-neutral-800">
                              <div className="px-6 py-2 flex-1">
                                <b>Item</b>
                              </div>
                              <div className="px-6 py-2 flex-1">
                                <b>Qnt</b>
                              </div>
                              <div className="px-6 py-2 flex-1">
                                <b>Price</b>
                              </div>
                            </div>

                            {recieptData.PrescriptionItems.map((item) => (
                              <ReceiptRow
                                key={item._id}
                                name={item.name}
                                qnt={item.quantity}
                                price={item.price}
                              />
                            ))}
                            {recieptData.OverTheCounterItems.map((item) => (
                              <ReceiptRow
                                key={item._id}
                                name={item.name}
                                qnt={item.quantity}
                                price={item.price}
                              />
                            ))}
                          </>
                        )}
                      </div>
                      <div className="right-0 m-1">
                        <p style={{ padding: "5px 5px" }}>
                          <b>Total Paid: {recieptData.totalAmount} </b>
                        </p>{" "}
                      </div>
                    </div>
                    <div>
                      <button className={submitButtonStyle} onClick={toPDF}>
                        Print Receipt
                      </button>
                    </div>
                  </Modal>
                </div>
              </>
            ) : (
              <button className={submitButtonStyle} type="submit">
                Complete Payment{" "}
              </button>
            )}{" "}
          </form>
        )}{" "}
        {paymentMethod === "card" && (
          <form
            onSubmit={handleSubmit}
            className="max-w-[800px] w-full mx-auto bg-transparent p-4 rounded border border-blue-500"
          >
            <div className="w-full  md:flex flex-1">
              <div className="w-full mx-2">
                <label className={labelSyle}> Cardholder First Name </label>{" "}
                <input
                  type="text"
                  placeholder="First Name"
                  className={inputStyle}
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required={!paid}
                  disabled={paid}
                />{" "}
              </div>{" "}
              <div className="w-full mx-2">
                <label className={labelSyle}> Cardholder Last Name </label>{" "}
                <input
                  type="text"
                  placeholder="Last Name"
                  className={inputStyle}
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required={!paid}
                  disabled={paid}
                />{" "}
              </div>{" "}
            </div>{" "}
            <div className="w-full md:flex">
              <div className="w-full mx-2">
                <label className={labelSyle}> Credit Card Number </label>{" "}
                <input
                  type="text"
                  placeholder="Number"
                  className={inputStyle}
                  id="cardNum"
                  name="cardNum"
                  value={formData.cardNum}
                  onChange={handleChange}
                  required={!paid}
                  disabled={paid}
                />{" "}
              </div>{" "}
              <div className="w-full mx-2">
                <label className={labelSyle}> Security Code </label>{" "}
                <input
                  type="text"
                  placeholder="Number"
                  className={inputStyle}
                  id="secCode"
                  name="secCode"
                  value={formData.secCode}
                  onChange={handleChange}
                  required={!paid}
                  disabled={paid}
                />{" "}
              </div>{" "}
            </div>{" "}
            <div className="w-full md:flex">
              <div className="w-full mx-2">
                <label className={labelSyle}> Expiration Date </label>{" "}
                <input
                  type="text"
                  placeholder="MM/YY"
                  className={inputStyle}
                  id="expDate"
                  name="expDate"
                  value={formData.expDate}
                  onChange={handleChange}
                  required={!paid}
                  disabled={paid}
                />{" "}
              </div>
              <div className="w-full mx-2">
                <label className={labelSyle}> Zip Code </label>{" "}
                <input
                  type="text"
                  placeholder="Zip Code"
                  className={inputStyle}
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required={!paid}
                  disabled={paid}
                />{" "}
              </div>{" "}
            </div>{" "}
            {paid ? (
              <button className={submitButtonStyle} type="button">
                Print Receipt{" "}
              </button>
            ) : (
              <button className={submitButtonStyle} type="submit">
                Complete Payment{" "}
              </button>
            )}{" "}
          </form>
        )}{" "}
      </div>{" "}
    </div>
  );
}
