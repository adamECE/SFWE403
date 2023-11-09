'use client';
import React, {useState, useEffect} from 'react';
import Swal from 'sweetalert2';
export default function PopupOverTheCounterItemWindow({
  overTheCounter,
  setPopupWindow,
  setCartItem,
  cartItem,
  total,
  setTotal,
}) {
  const [confirmFillWindow, setConfirmFillWindow] = useState(false);
  const [itemExpired, setItemExpired] = useState(false);
  const [itemNotAvailable, setItemNotAvailable] = useState(false);
  const [itemAvailable, setItemAvailable] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedItemIndex, setSelectedItemIndex] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedItemPrice, setSelectedItemPrice] = useState(0);
  const [selectedItemQnt, setSelectedItemQnt] = useState(0);

  const [showBatchInfo, setShowBatchInfo] = useState(false);
  const [batchInfo, setBatchInfo] = useState({
    quantity: '',
    expDate: '',
  });
  const inputStyle =
    'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline';
  const labelSyle = 'block text-black text-sm font-bold mb-2';

  const initialState = {
    barcode: '',
    item: '',
    qnt: '',
  };
  const [formData, setFormData] = useState(initialState);

  const handleCloseModalBtn = (e) => {
    e.preventDefault();
    setPopupWindow(false);
  };

  const handleChange = (e) => {
    const i = overTheCounter.findIndex((item) => item._id == selectedItem);
    setSelectedItemIndex(i);
    setFormData({...formData, [e.target.name]: e.target.value});

    const bt = overTheCounter[i].batches.find(function (batch) {
      return batch.barcode == e.target.value;
    });
    setSelectedItemPrice(overTheCounter[i].price);
    setSelectedBatch(bt.barcode);
    setSelectedItemQnt(bt.quantity);
    setBatchInfo({
      quantity: bt.quantity,
      expDate: new Date(bt.expirationDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
    });
    setShowBatchInfo(true);
  };

  const handleItemChange = (e) => {
    setSelectedItem(e.target.value);
    setFormData({...formData, [e.target.name]: e.target.value});
    setIsSelected(true);
    // Reset the selected batch when the item changes
    setSelectedBatch('');
    setShowBatchInfo(false);
  };

  const handleQntChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (Number(formData['qnt']) <= Number(selectedItemQnt)) {
      setCartItem([
        ...cartItem,
        {
          itemID: overTheCounter[selectedItemIndex]._id,
          name: overTheCounter[selectedItemIndex].name,
          barcode: selectedBatch,
          quantity: Number(formData['qnt']),
          price:
            overTheCounter[selectedItemIndex].price * Number(formData['qnt']),
        },
      ]);
      setTotal(
        total +
          overTheCounter[selectedItemIndex].price * Number(formData['qnt'])
      ),
        Swal.fire('Item added on Cart', '', 'success');
    } else {
      Swal.fire(`Qunatity not available on this batch`, '', 'error');
    }
  };

  return (
    <>
      <div
        id="myModal"
        className="modal p-10px fixed w-full h-fulltop-0 left-0 right-0 z-50 flex items-center justify-center overflow-auto"
      >
        <div className="modal-content border-2 border-gray-800 border-opacity-100 bg-white p-8 rounded shadow-lg relative overflow-y-auto">
          <button
            className="top-0 right-0 m-1 px-2 py-1 bgCor text-white rounded absolute"
            onClick={handleCloseModalBtn}
          >
            &times;{' '}
          </button>{' '}
          <div className="">
            <h3 className="border-2 px-4 py-2 text-black">
              {' '}
              Available Over - the - counter Items{' '}
            </h3>{' '}
          </div>{' '}
          <div className="flex w-full">
            <div className="px-4 py-2 flex-1">
              <select
                className={inputStyle}
                id="item"
                name="item"
                value={formData.item}
                onChange={handleItemChange}
                required
              >
                <option value=""> -- choose the item-- </option>{' '}
                {overTheCounter.map((item) => (
                  <option key={item._id} value={item._id}>
                    {' '}
                    {item.name}{' '}
                  </option>
                ))}{' '}
              </select>{' '}
            </div>{' '}
            {isSelected && (
              <div className="px-4 py-2 flex-1">
                <select
                  className={inputStyle}
                  id="barcode"
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleChange}
                  required
                >
                  <option value=""> --select a Batch-- </option>{' '}
                  {overTheCounter.map((item) =>
                    item._id == selectedItem
                      ? item.batches.map((batch) => (
                          <option key={batch.barcode} value={batch.barcode}>
                            {' '}
                            {batch.barcode}{' '}
                          </option>
                        ))
                      : ''
                  )}{' '}
                </select>{' '}
              </div>
            )}{' '}
          </div>{' '}
          {showBatchInfo && (
            <>
              <div className="flex w-full">
                <div className="px-4 py-2">
                  <div className="bgCor flex">
                    <p className=" py-2 text-black">
                      <b> Selected Batch Info: </b>{' '}
                    </p>{' '}
                    <hr className=" text-black" />
                    <p className="flex-1">
                      Available Quantity: {batchInfo.quantity}{' '}
                    </p>{' '}
                    <p className="flex-1">
                      Expiration Date: {batchInfo.expDate}{' '}
                    </p>{' '}
                  </div>{' '}
                </div>{' '}
              </div>{' '}
              <hr className="px-4 py-2 text-black" />{' '}
              <div className="flex">
                <form onSubmit={handleAddItem}>
                  <div className="flex">
                    <div className="px-4 py-2 flex-1">
                      <label className={labelSyle}> Quantity: </label>{' '}
                      {overTheCounter.quantity}{' '}
                      <input
                        type="number"
                        min="1"
                        name="qnt"
                        id="qnt"
                        className={inputStyle}
                        onChange={handleQntChange}
                        required
                      ></input>{' '}
                    </div>{' '}
                    <div className="px-4 py-2 flex-1">
                      <label className={labelSyle}> Price: </label>{' '}
                      <p className={inputStyle}>
                        {' '}
                        {overTheCounter[selectedItemIndex].price}
                      </p>{' '}
                    </div>{' '}
                    <div className="px-4 py-4 flex-1">
                      <button
                        className="bottom-0 right-0 m-2 px-4 py-4 bgCor text-white rounded"
                        type="submit"
                      >
                        Add to cart{' '}
                      </button>{' '}
                    </div>
                  </div>{' '}
                </form>{' '}
              </div>{' '}
            </>
          )}{' '}
          <div className="flex">
            <div className="flex-1"> </div>{' '}
          </div>{' '}
        </div>{' '}
      </div>{' '}
    </>
  );
}
