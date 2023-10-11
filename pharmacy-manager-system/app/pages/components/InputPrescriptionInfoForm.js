'use client';
import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';

export default function InputPrescriptionInfo() {
  const router = useRouter();
  const blockStyle = 'm-5  p-5 flex flex-col justify-center items-center';
  const centerStyle = 'text-center text-white';
  const inputStyle =
    'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline';
  const submitButtonStyle =
    'bgCor border rounded w-full my-5 py-2  text-white appearance-none focus:outline-none focus:shadow-outline';
  const labelSyle = 'block text-white text-sm font-bold mb-2';
  const inputStyleForm1 =
    '  relative m-0 -mr-0.5 block w-[1px] min-w-0 flex-auto rounded-l border py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline';
  const submitButton1Style =
    'z-[4] bgCor inline-block rounded-r bg-cyan-100 px-6 pb-2 pt-2.5  font-medium uppercase leading-normal text-white focus:outline-none focus:shadow-outline';

  const [inventoryItems, setInventoryItems] = useState([]);
  const [inventoryUpdated, setInventoryUpdated] = useState(false);
  const [findUser, setFindUser] = useState(false);
  const [User, setUser] = useState({});

  useEffect(() => {
    setInventoryUpdated(!inventoryUpdated);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token'); // get auth token from localStorage

    fetch('http://127.0.0.1:3030/pharmacy-0x2/api/inventory/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // include bearer token in the Autho header
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
      })
      .catch((error) => {
        console.error('Fetch error:', error);
      });
  }, [inventoryUpdated]);

  const initialState = {
    email: '',
    userID: '',
    doctorName: '',
    medicationID: '',
    quantity: '',
    dosage: '',
    deliveredBy: '',
    refills: '',
    allowRefill: 'No',
    dueDate: '',
  };
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    //alert(e.target.value )
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.allowRefill == 'Yes' && Number(formData.refills) == 0) {
        alert('If refills is allowed, Number of refills should not be zero');
        return;
      }

      if (formData.allowRefill == 'No' && Number(formData.refills) > 0) {
        alert('If refills is not allowed, Number of refills should be zero');
        return;
      }
      const token = localStorage.getItem('token');

      const response = await fetch(
        'http://127.0.0.1:3030/pharmacy-0x2/api/patientHistory/add-prescription',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            // Include the bearer token in the Authorization header
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            userID: User.userID,
            doctorName: formData.doctorName,
            medicationID: formData.medicationID,
            quantity: Number(formData.quantity),
            dosage: formData.dosage,
            deliveredBy: formData.deliveredBy,
            refillPolicy: {
              refills: Number(formData.refills),
              allowRefill: formData.allowRefill == 'No' ? false : true,
              dueDate: new Date(formData.dueDate),
            },
          }),
        }
      );

      if (response.ok) {
        setFormData(initialState);
        const responseText = await response.text();
        alert(JSON.parse(responseText).message);
        setFindUser(false);
        router.refresh();
      } else {
        setFormData(initialState);
        const errorText = await response.text();
        alert(JSON.parse(errorText).error);
      }
    } catch (error) {
      console.error('error:', error);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const email = formData.email;

      const response = await fetch(
        `http://127.0.0.1:3030/pharmacy-0x2/api/a-patient/${email}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setFormData(initialState);
        setUser({
          fullName: `${data.firstName} ${data.lastName}`,
          email: email,
          userID: data._id,
        });
        setFindUser(true);
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
      router.push('/pages/');
    }
  });

  return (
    <div>
      <h2 className={centerStyle}>Input Prescription Info</h2>
      <div className={blockStyle}>
        {!findUser ? (
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-[800px] w-full mx-auto bg-transparent p-4 rounded "
          >
            <h3> Patient Email</h3>
            <hr className="mb-2" />
            <div className="  relative mb-4 flex flex-wrap items-stretch">
              <input
                type="email"
                placeholder="Email"
                className={inputStyleForm1}
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <button className={submitButton1Style} type="submit">
                {' '}
                Search
              </button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="max-w-[800px] w-full mx-auto bg-transparent p-4 rounded border border-blue-500"
          >
            <hr className="mb-2" />
            <h3 className="text-left mb-4">
              New Prescription Item for: {`${User.fullName} (${User.email})`}
            </h3>
            <hr className="mb-4" />
            {/* <h3> Prescription Info </h3> */}

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
                <label className={labelSyle}>Medication</label>
                <select
                  className={inputStyle}
                  id="medicationID"
                  name="medicationID"
                  value={formData.medicationID}
                  onChange={handleChange}
                  required
                >
                  <option value=""> -- select an option -- </option>

                  {inventoryItems
                    .filter((item) => item.category === 'prescription')
                    .map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))}
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
                  value={formData.dosage}
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
                  <option value="" style={{display: 'none'}}>
                    {' '}
                    -- select an option --{' '}
                  </option>
                  <option value="patient">Patient</option>
                  <option value="doctor's office">Doctor's Office</option>
                </select>
              </div>
            </div>
            <h3> Refill Policy </h3>
            <hr className="mb-2" />
            <div className="w-full flex-1 md:flex ">
              <div className="w-full mx-2">
                <label className={labelSyle}> # Refills</label>
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
                <div
                  style={{
                    background: 'white',
                    border: '3px solid white',
                    padding: '4.1px',
                    borderRadius: '5px',
                    display: 'flex',
                    justifyContent: 'space-around',
                  }}
                >
                  <label style={{color: 'gray', fontSize: '1.1em'}}>Yes</label>
                  <input
                    type="radio"
                    id="allowRefillYes"
                    name="allowRefill"
                    value="Yes"
                    checked={formData.allowRefill === 'Yes'}
                    onChange={handleChange}
                    style={{width: '2em'}}
                  />
                  <label style={{color: 'gray', fontSize: '1.1em'}}>No</label>
                  <input
                    type="radio"
                    id="allowRefillNo"
                    name="allowRefill"
                    value="No"
                    checked={formData.allowRefill === 'No'}
                    onChange={handleChange}
                    style={{width: '2em'}}
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
        )}
      </div>
    </div>
  );
}
