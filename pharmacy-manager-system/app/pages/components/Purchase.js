"use client";
import { useEffect, useState } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import { FaCartPlus } from "react-icons/fa";
import { LuListRestart } from "react-icons/lu";
import Box from "@mui/material/Box";
import { BsTrash, BsPencilSquare } from "react-icons/bs";
import { GiMedicinePills } from "react-icons/gi";
import Swal from "sweetalert2";
import PopupOverTheCounterItemWindow from "./PopupOverTheCounterWindow";
import DataTable from "react-data-table-component";
import { useRouter, useSearchParams } from "next/navigation";

export default function Prescription() {
  const [selectedPatient, setPatient] = useState([]);
  const [selectedPrescriptions, setSelectedPrescriptions] = useState([]);
  const [overTheCounter, setOverTheCounter] = useState([]);
  const [cartItem, setCartItem] = useState([]);
  const [total, setTotal] = useState(0);
  const [popupWindow, setPopupWindow] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [findUser, setFindUser] = useState(false);

  const submitButtonStyle =
    "z-[4] bgCor inline-block rounded bg-cyan-100 px-6 pb-2 pt-2.5 my-5  font-medium uppercase leading-normal text-white focus:outline-none focus:shadow-outline";

  const inputStyle =
    "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline";
  const labelStyle = "block text-white text-sm font-bold mb-2";
  const initialState = {
    userEmail: "",
  };
  const [formData, setFormData] = useState(initialState);
  const columns = [
    ,
    {
      name: "Item",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Qnt",
      selector: (row) => row.quantity,
      sortable: true,
    },
    {
      name: "Price",
      selector: (row) => row.price,
      sortable: true,
    },
    {
      name: "Barcode",
      selector: (row) => row.barcode,
      sortable: true,
    },
    {
      name: "Remove",
      cell: (param) => {
        return (
          <>
            <Button onClick={() => handleDelete(param)} color="error">
              <BsTrash size="20px" />
            </Button>
          </>
        );
      },
    },
  ];

  function handleDelete(e) {
    setCartItem(cartItem.filter((item) => item.barcode !== e.barcode));
    setTotal(total - e.price);
  }
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // get auth token from localStorage

    try {
      // First API call
      const getPatStr =
        "http://127.0.0.1:3030/pharmacy-0x2/api/patientHistory/patient-prescription-pickup/" +
        formData.userEmail;
      const response = await fetch(getPatStr, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setFindUser(false);
        //alert(" User not found");
        Swal.fire(`User not found`, "", "error");
        return;
      }

      const patientData = await response.json();
      setPatient(patientData.prescription);
      setFindUser(true);
      setSelectedPrescriptions([]);
      await loadOver();
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
  const handlePayment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // get auth token from localStorage

    try {
      // First API call
      const getPatStr =
        "http://127.0.0.1:3030/pharmacy-0x2/api/purchase/checkout/";
      const response = await fetch(getPatStr, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          soldTo: formData.userEmail,
          PrescriptionItems: selectedPrescriptions,
          OverTheCounterItems: cartItem,
          totalAmount: total,
        }),
      });

      if (!response.ok) {
        Swal.fire(`oops`, "", "error");
        return;
      }
      const responseText = await response.text();

      setCartItem([]);
      setSelectedPrescriptions([]);
      setTotal(0);
      router.push(
        `./checkout/orderPayment?receiptID=${JSON.parse(responseText).message}`
      );
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handlePrescriptionChange = (
    e,
    prescriptionId,
    filledID,
    medicationID,
    price,
    name,
    quantity
  ) => {
    const checked = e.target.checked;
    if (checked) {
      setTotal(total + price);
      // If the checkbox is checked, add to selectedPrescriptions
      setSelectedPrescriptions([
        ...selectedPrescriptions,
        {
          prescriptionID: prescriptionId,
          filledInfoID: filledID,
          medicationID: medicationID,
          price: price,
          name: name,
          quantity: quantity,
        },
      ]);
    } else {
      // If the checkbox is unchecked, remove from selectedPrescriptions
      setSelectedPrescriptions(
        selectedPrescriptions.filter(
          (prescription) => prescription.filledInfoID !== filledID
        )
      );
      setTotal(total - price);
    }
  };
  const addOver = async () => {
    setPopupWindow(true);
  };

  const loadOver = async () => {
    const token = localStorage.getItem("token"); // get auth token from localStorage

    try {
      // First API call
      const getPatStr =
        "http://127.0.0.1:3030/pharmacy-0x2/api/inventory/over-the-counter";
      const response = await fetch(getPatStr, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        Swal.fire(`User not found`, "", "error");
        return;
      }

      const overData = await response.json();
      setOverTheCounter(overData);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
  useEffect(() => {
    setCartItem(cartItem);
  }, [cartItem]);

  function resetCart() {
    setCartItem([]);
    setSelectedPrescriptions([]);
    setTotal(0);
    setFindUser(false);
    setFormData(initialState);
  }
  const thStyle = " px-6 py-4";
  const blockStyle = "m-5 p-5 flex flex-col justify-center items-center ";
  return (
    <div className={blockStyle}>
      <div className="w-full mx-2 text-white flex">
        <button
          className="right-0 m-2 top-5 px-4 py-2  bgCor text-white rounded absolute"
          onClick={resetCart}
        >
          <LuListRestart size="1.5rem" />
        </button>{" "}
      </div>
      <h2> Checkout </h2> <hr className="mb-2" />
      <hr />
      <div className="w-full  md:flex flex-1">
        {popupWindow && (
          <PopupOverTheCounterItemWindow
            overTheCounter={overTheCounter}
            setPopupWindow={setPopupWindow}
            setCartItem={setCartItem}
            cartItem={cartItem}
            total={total}
            setTotal={setTotal}
          />
        )}
        <div className="w-full mx-2 flex">
          <div className="w-full mx-2 flex-row flex-1">
            <div className="flex-1">
              <form
                onSubmit={handleCheckSubmit}
                className="max-w-[800px] w-full bg-transparent my-0 rounded "
              >
                <noscript>
                  <input type="submit" />
                </noscript>{" "}
                <div class="relative mb-4 flex   flex-wrap my-5 items-stretch top-6">
                  <span class="flex items-center whitespace-nowrap rounded-l  bgCor border border-r-0 border-solid border-neutral-300 px-3  text-center text-base font-normal leading-[1.6] text-white dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200">
                    User Email
                  </span>
                  <input
                    type="text"
                    placeholder="Enter User Email"
                    className={` relative m-0 block w-[1px] min-w-0 flex-auto rounded-r  bg-clip-padding py-2 px-2  text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary`}
                    id="userEmail"
                    name="userEmail"
                    value={formData.userEmail}
                    onChange={handleChange}
                    required={!findUser}
                    disabled={findUser}
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                  />
                </div>
              </form>{" "}
            </div>
            <div className="w-full mx-0 flex-1">
              <div class="relative mb-4 flex   flex-wrap my-5 items-stretch top-6">
                <span class="flex items-center whitespace-nowrap rounded-l  bgCor border border-r-0 border-solid border-neutral-300 px-3  text-center text-base font-normal leading-[1.6] text-white dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200">
                  Total
                </span>
                <input
                  value={new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(total)}
                  disabled
                  type="text"
                  className="relative m-0 block w-[1px] min-w-0 flex-auto rounded-r  bg-clip-padding py-2 px-3  text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
                  placeholder="Username"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />
              </div>
            </div>
            <div className="w-full mx-0 flex-1 my-6 ">
              {" "}
              {total > 0.01 ? (
                <button
                  className={`${submitButtonStyle} w-full`}
                  onClick={handlePayment}
                >
                  pay
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="w-full mx-2 flex-row flex-1">
            {findUser ? (
              <>
                <div className="w-full  md:flex ">
                  <div className="w-full mx-2 right-0">
                    <h3 className="my-2 "> Prescriptions </h3>
                    <hr />
                    <>
                      <FormGroup>
                        {selectedPatient.length > 0
                          ? selectedPatient.map((item) =>
                              item.filledInfo.map((filledItem) => (
                                <>
                                  <FormControlLabel
                                    className={labelStyle}
                                    key={filledItem._id}
                                    control={<Checkbox />}
                                    onChange={(e) =>
                                      handlePrescriptionChange(
                                        e,
                                        item._id,
                                        filledItem._id,
                                        item.medicationInfo._id,
                                        item.medicationInfo.price,
                                        item.medicationInfo.name,
                                        item.quantity
                                      )
                                    }
                                    label={`${
                                      item.medicationInfo.name
                                    } | Qnt: ${
                                      item.quantity
                                    }  | Filled on: ${new Date(
                                      filledItem.filledDate
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                    })} | Price: ${item.medicationInfo.price}`}
                                  />
                                  <hr />
                                </>
                              ))
                            )
                          : "No precription"}
                      </FormGroup>
                    </>
                  </div>
                </div>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>{" "}
      {findUser ? (
        <>
          <div className="w-full mx-2 my-2">
            <h3>
              <span>Over the counter</span>

              <hr />
            </h3>
            <button
              className=" mx-2 my-2 p-3 bordered rounded bg-white"
              onClick={addOver}
            >
              <FaCartPlus size="1.5rem" color="#86bbd8" />
            </button>
            <DataTable columns={columns} data={cartItem} pagination></DataTable>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
