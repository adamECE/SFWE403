'use client';
import {useState, useEffect} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
export default function OrderPayment() {
  const [role, setRole] = useState('');
  const [paid, setPaid] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(''); // Default to cash
  const [recieptData, setRecieptData] = useState(); // Default to cash
  const [foundData, setFoundData] = useState(false); // Default to cash

  const blockStyle = 'm-5  p-5 flex flex-col justify-center items-center';
  const centerStyle = 'text-center text-white';
  const inputStyle =
    'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline';
  const selectStyle =
    'shadow  border mx-2 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline';
  const submitButtonStyle =
    'bg-blue-500 hover:bg-blue-700  border rounded w-full my-5 py-2  text-white appearance-none focus:outline-none focus:shadow-outline';
  const labelSyle = 'block text-white text-sm font-bold mb-2';
  const labelStyle = 'block text-white text-sm font-bold mb-2';
  const labelChoices = 'block text-white text-sm font-bold mb-2';
  const searchParams = useSearchParams();

  const initialState = {
    email: '',
    phoneNumber: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    streetName: '',
    city: '',
    state: '',
    zipCode: '',
    role: '',
  };
  const [formData, setFormData] = useState(initialState);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      // Make a POST request to your login endpoint
      const response = await fetch(
        'http://127.0.0.1:3030/pharmacy-0x2/api/purchase/pay',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Include the bearer token in the Authorization header
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            paymentMethod: paymentMethod,
            purchaseID: searchParams.get('receiptID'),
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
        alert(JSON.parse(responseText).message);
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
    const token = localStorage.getItem('token'); // get auth token from localStorage
    const receiptID = searchParams.get('receiptID');

    fetch(
      'http://127.0.0.1:3030/pharmacy-0x2/api/purchase/checkout-info/' +
        receiptID,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response error');
        }
        return res.json();
      })
      .then((data) => {
        setRecieptData(data.purchaseData);
        setFoundData(true);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
      });
  }, [foundData]);

  useEffect(() => {
    if (!localStorage.getItem('isACCountActive')) {
      router.push('/pages/');
    }
  });

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };
  return (
    <div>
      <div className="mx-3 my-3">
        <h3 className="text-white py-3">
          {' '}
          <span>User Email: {foundData ? recieptData.soldTo : ''}</span> <br />
          <br />
          <span className="mx-3 my-3">
            Total Amount:{' '}
            {foundData
              ? new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(recieptData.totalAmount)
              : ''}
          </span>{' '}
          <hr />
          <hr />
        </h3>
      </div>
      <h3 className={centerStyle}> Payment Method </h3>{' '}
      <div className={blockStyle}>
        <div>
          <label className={labelStyle}> Select Payment Method: </label>{' '}
          <div style={{display: 'flex', alignItems: 'center'}}>
            <input
              type="radio"
              id="cash"
              name="paymentMethod"
              value="cash"
              checked={paymentMethod === 'cash'}
              onChange={handlePaymentMethodChange}
              style={{verticalAlign: 'middle', marginRight: '8px'}}
            />{' '}
            <label className={labelChoices}> Cash </label>{' '}
          </div>{' '}
          <div style={{display: 'flex', alignItems: 'center'}}>
            <input
              type="radio"
              id="card"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={handlePaymentMethodChange}
              style={{vertical: 'middle', marginRight: '8px'}}
            />{' '}
            <label className={labelChoices}> Card </label>{' '}
          </div>{' '}
        </div>{' '}
        {paymentMethod === 'cash' && (
          <form
            onSubmit={handleSubmit}
            className="max-w-[800px] w-full mx-auto bg-transparent p-4 rounded border border-blue-500"
          >
            <div className="w-full  md:flex flex-1">
              <div className="w-full mx-2">
                <label className={labelSyle}> Cash Amount </label>{' '}
                <input
                  type="text"
                  placeholder="$0.00"
                  className={inputStyle}
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>{' '}
            </div>{' '}
            {paid ? (
              <button className={submitButtonStyle} type="submit">
                Print Receipt{' '}
              </button>
            ) : (
              <button className={submitButtonStyle} type="submit">
                Complete Payment{' '}
              </button>
            )}
          </form>
        )}{' '}
        {paymentMethod === 'card' && (
          <form
            onSubmit={handleSubmit}
            className="max-w-[800px] w-full mx-auto bg-transparent p-4 rounded border border-blue-500"
          >
            <div className="w-full  md:flex flex-1">
              <div className="w-full mx-2">
                <label className={labelSyle}> Cardholder First Name </label>{' '}
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
              </div>{' '}
              <div className="w-full mx-2">
                <label className={labelSyle}> Cardholder Last Name </label>{' '}
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
              </div>{' '}
            </div>{' '}
            <div className="w-full md:flex">
              <div className="w-full mx-2">
                <label className={labelSyle}> Credit Card Number </label>{' '}
                <input
                  type="text"
                  placeholder="Number"
                  className={inputStyle}
                  id="cardNum"
                  name="cardNum"
                  value={formData.cardNum}
                  onChange={handleChange}
                  required
                />
              </div>{' '}
              <div className="w-full mx-2">
                <label className={labelSyle}> Security Code </label>{' '}
                <input
                  type="text"
                  placeholder="Number"
                  className={inputStyle}
                  id="secCode"
                  name="secCode"
                  value={formData.secCode}
                  onChange={handleChange}
                  required
                />
              </div>{' '}
            </div>{' '}
            <div className="w-full md:flex">
              <div className="w-full mx-2">
                <label className={labelSyle}> Expiration Date </label>{' '}
                <input
                  type="text"
                  placeholder="MM/YY"
                  className={inputStyle}
                  id="expDate"
                  name="expDate"
                  value={formData.expDate}
                  onChange={handleChange}
                  required
                />
              </div>{' '}
              <div className="w-full mx-2">
                <label className={labelSyle}> Zip Code </label>{' '}
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
              </div>{' '}
            </div>{' '}
            {paid ? (
              <button className={submitButtonStyle} type="submit">
                Print Receipt{' '}
              </button>
            ) : (
              <button className={submitButtonStyle} type="submit">
                Complete Payment{' '}
              </button>
            )}
          </form>
        )}{' '}
      </div>{' '}
    </div>
  );
}
