"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddToInventoryPage() {
  const initialState = {
    name: "",
    description: "",
    manufacturer: "",
    price: "",
    location: "",
  };
  const [inventoryItemInfo, setInventoryItemInfo] = useState(initialState);
  const [selectedOption, setSelectedOption] = useState("prescription");
  const [warningMsg, setWarningMsg] = useState("");

  const router = useRouter();

  const handleChange = (e) => {
    setInventoryItemInfo({
      ...inventoryItemInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (inventoryItemInfo.price <= 0) {
      setWarningMsg("Price should not be zero");
    } else {
      setWarningMsg("");
      // TODO: Connect FE and Backend

      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://127.0.0.1:3030/pharmacy-0x2/api/inventory/add-item",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Include the bearer token in the Authorization header
              Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify({
              name: inventoryItemInfo.name,
              description: inventoryItemInfo.description,
              category: selectedOption,
              price: inventoryItemInfo.price,
              manufacturer: inventoryItemInfo.manufacturer,
              location: inventoryItemInfo.location,
            }),
          }
        );

        if (response.ok) {
          setInventoryItemInfo(initialState);
          const responseText = await response.text();
          alert(JSON.parse(responseText).message);
          router.refresh();
        } else {
          setInventoryItemInfo(initialState);
          const errorText = await response.text();
          alert(JSON.parse(errorText).error);
        }
      } catch (error) {
        console.error("error:", error);
      }
      // all field inputs can be found in inventoryItemInfo
      // except for the category which is found in selectedOption
      console.log(inventoryItemInfo);
      console.log(selectedOption);
    }
  };

  const handleBackToInv = (e) => {
    router.push("/pages/inventory");
  };

  // All styles
  const blockStyle = "m-5  p-5 flex flex-col justify-center items-center";
  const centerStyle = "text-center text-white";
  const inputStyle =
    "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline";
  const submitButtonStyle =
    "bgCor border rounded w-full my-5 py-2  text-white appearance-none focus:outline-none focus:shadow-outline";
  const labelSyle = "block text-white text-sm font-bold mb-2";
  const formStyle =
    "max-w-[800px] w-full mx-auto bg-transparent p-4 rounded" +
    "border border-blue-500";

  return (
    <div>
      <button
        className="top-5 left-0 m-2 px-4 py-2 bgCor text-white rounded absolute"
        onClick={handleBackToInv}
      >
        Back To Inventory{" "}
      </button>{" "}
      <h2 className={centerStyle}> Add Inventory Item </h2>{" "}
      <div className={blockStyle}>
        <form onSubmit={handleSubmit} className={formStyle}>
          <h3> Inventory Info </h3> <hr className="mb-2" />
          <div className="w-full  md:flex flex-1">
            <div className="w-full mx-2">
              <label className={labelSyle}>Medication Name </label>{" "}
              <input
                type="text"
                placeholder="name"
                className={inputStyle}
                id="name"
                name="name"
                value={inventoryItemInfo.name}
                onChange={handleChange}
                required={true}
              />{" "}
            </div>{" "}
            <div className="w-full mx-2">
              <label className={labelSyle}> Description </label>{" "}
              <input
                type="text"
                placeholder="description"
                className={inputStyle}
                id="description"
                name="description"
                value={inventoryItemInfo.description}
                onChange={handleChange}
                required={true}
              />{" "}
            </div>{" "}
          </div>{" "}
          <div className="w-full  md:flex flex-1"></div>{" "}
          <div className="w-full  md:flex flex-1">
            <div className="w-full mx-2 text-white">
              <label className={labelSyle}> category </label>{" "}
              <input
                type="radio"
                name="prescription"
                value="prescription"
                className="mx-5 px-5"
                checked={selectedOption === "prescription"}
                onChange={(e) => setSelectedOption(e.target.value)}
              />
              Prescription{" "}
              <input
                type="radio"
                name="over-the-counter"
                value="over-the-counter"
                className="mx-5 px-5"
                checked={selectedOption === "over-the-counter"}
                onChange={(e) => setSelectedOption(e.target.value)}
              />
              Over the Counter{" "}
            </div>{" "}
            <div className="w-full mx-2">
              <label className={labelSyle}> Manufacturer </label>{" "}
              <input
                type="text"
                placeholder="manufacturer"
                className={inputStyle}
                id="manufacturer"
                name="manufacturer"
                value={inventoryItemInfo.manufacturer}
                onChange={handleChange}
                required={true}
              />{" "}
            </div>{" "}
          </div>{" "}
          <div className="w-full  md:flex flex-1">
            <div className="w-full mx-2">
              <label className={labelSyle}> Price </label>{" "}
              <input
                type="number"
                placeholder="price"
                className={inputStyle}
                id="price"
                name="price"
                min="0"
                step="0.01"
                value={inventoryItemInfo.price}
                onChange={handleChange}
                required={true}
              />{" "}
            </div>{" "}
            <div className="w-full mx-2">
              <label className={labelSyle}> Location </label>{" "}
              <input
                type="text"
                placeholder="location"
                className={inputStyle}
                id="location"
                name="location"
                value={inventoryItemInfo.location}
                onChange={handleChange}
                required={true}
              />{" "}
            </div>{" "}
          </div>{" "}
          <div className="w-full  md:flex flex-1"></div>{" "}
          {true && <div className="mx-2 my-2 text-red-500"> {warningMsg} </div>}{" "}
          <button className={submitButtonStyle} type="submit">
            Place Order{" "}
          </button>
        </form>
      </div>{" "}
    </div>
  );
}
