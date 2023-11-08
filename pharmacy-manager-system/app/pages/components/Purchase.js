'use client';
import {useEffect, useState} from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import {BsTrash, BsPencilSquare} from 'react-icons/bs';
import {GiMedicinePills} from 'react-icons/gi';
import Swal from 'sweetalert2';
import PopupOverTheCounterItemWindow from './PopupOverTheCounterWindow';
import DataTable from 'react-data-table-component';
export default function Prescription() {
  const [selectedPatient, setPatient] = useState([]);
  const [selectedPrescriptions, setSelectedPrescriptions] = useState([]);
  const [overTheCounter, setOverTheCounter] = useState([]);
  const [cartItem, setCartItem] = useState([]);
  const [total, setTotal] = useState(0);
  const [popupWindow, setPopupWindow] = useState(false);

  const [findUser, setFindUser] = useState(false);

  const submitButtonStyle =
    'z-[4] bgCor inline-block rounded-r bg-cyan-100 px-6 pb-2 pt-2.5  font-medium uppercase leading-normal text-white focus:outline-none focus:shadow-outline';

  const inputStyle =
    'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline';
  const labelStyle = 'block text-white text-sm font-bold mb-2';
  const initialState = {
    userEmail: '',
  };
  const [formData, setFormData] = useState(initialState);
  const columns = [
    ,
    {
      name: 'Item',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Qnt',
      selector: (row) => row.quantity,
      sortable: true,
    },
    {
      name: 'Price',
      selector: (row) => row.price,
      sortable: true,
    },

    {
      name: 'Action',
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
    setCartItem(cartItem.filter((item) => item.itemID !== e.itemID));
    setTotal(total - e.price);
  }
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleCheckSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // get auth token from localStorage

    try {
      // First API call
      const getPatStr =
        'http://127.0.0.1:3030/pharmacy-0x2/api/patientHistory/patient-prescription-pickup/' +
        formData.userEmail;
      const response = await fetch(getPatStr, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setFindUser(!findUser);
        //alert(" User not found");
        Swal.fire(`User not found`, '', 'error');
        return;
      }

      const patientData = await response.json();
      setPatient(patientData.prescription);
      setFindUser(!findUser);
      setSelectedPrescriptions([]);
      await loadOver();
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // get auth token from localStorage

    try {
      // First API call
      const getPatStr =
        'http://127.0.0.1:3030/pharmacy-0x2/api/purchase/checkout/';
      const response = await fetch(getPatStr, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
        Swal.fire(`oops`, '', 'error');
        return;
      }
      const responseText = await response.text();
      alert(JSON.parse(responseText).message);
    } catch (error) {
      console.error('Fetch error:', error);
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
      console.log(selectedPrescriptions);
    } else {
      // If the checkbox is unchecked, remove from selectedPrescriptions
      setSelectedPrescriptions(
        selectedPrescriptions.filter(
          (prescription) => prescription.filledInfoID !== filledID
        )
      );
      setTotal(total - price);
      console.log(selectedPrescriptions);
    }
  };

  const addOver = async () => {
    setPopupWindow(true);
  };

  const loadOver = async () => {
    const token = localStorage.getItem('token'); // get auth token from localStorage

    try {
      // First API call
      const getPatStr =
        'http://127.0.0.1:3030/pharmacy-0x2/api/inventory/over-the-counter';
      const response = await fetch(getPatStr, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // setFindUser(!findUser);
        //alert(" User not found");
        Swal.fire(`User not found`, '', 'error');
        return;
      }

      const overData = await response.json();
      setOverTheCounter(overData);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  useEffect(() => {
    setCartItem(cartItem);
  }, [cartItem]);
  const thStyle = ' px-6 py-4';
  const blockStyle = 'm-5 p-5 flex flex-col justify-center items-center ';
  return (
    <div className={blockStyle}>
      <h3> Fill Patient Prescription </h3> <hr className="mb-2" />
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
        <div className="w-full mx-2">
          <form
            onSubmit={handleCheckSubmit}
            className="max-w-[800px] w-full mx-auto bg-transparent p-4 rounded "
          >
            <noscript>
              <input type="submit" />
            </noscript>{' '}
            <label className={labelStyle}> Enter Patient Email </label>{' '}
            <input
              type="text"
              placeholder="User Email"
              className={inputStyle}
              id="userEmail"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleChange}
              required={!findUser}
              disabled={findUser}
            />
          </form>{' '}
        </div>
        <div className="w-full mx-2">
          <label className={labelStyle}> Total</label>{' '}
          <input
            type="text"
            className={inputStyle}
            value={new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(total)}
            disabled
          />
          <button onClick={handlePayment}>pay</button>
        </div>
      </div>{' '}
      {findUser ? (
        <>
          <div className="w-full  md:flex">
            <div className="w-full mx-2  flex-1">
              <h3> Prescriptions </h3>
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
                              label={`${item.medicationInfo.name} | Qnt: ${item.quantity}  | Filled on: ${filledItem.filledDate} | Price: ${item.medicationInfo.price}`}
                            />
                            <hr />
                          </>
                        ))
                      )
                    : 'No precription'}
                </FormGroup>
              </>

              <button
                onClick={(e) => {
                  console.log(selectedPrescriptions);
                }}
              >
                add
              </button>
            </div>
            <div className="w-full mx-2  flex-1">
              <h3>
                <button onClick={addOver}> Add Over the counter</button>{' '}
              </h3>
              {cartItem.length > 0 ? (
                <DataTable
                  title="Auth Logs"
                  columns={columns}
                  data={cartItem}
                  pagination
                  //   progressPending={pending}
                  //   progressComponent={<CustomLoader />}
                ></DataTable>
              ) : (
                ''
              )}
            </div>
          </div>
        </>
      ) : (
        ''
      )}{' '}
    </div>
  );
}
