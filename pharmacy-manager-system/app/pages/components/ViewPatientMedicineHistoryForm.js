'use client';
import {useState, useEffect} from 'react';
import {useSearchParams} from 'next/navigation';
import {useRouter} from 'next/navigation';
import DataTable from 'react-data-table-component';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
export default function ViewPatientMedicineHistory({
  historyItems,
  setHistoryItems,
  userInfo,
  setUserInfo,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, setPending] = useState(true);

  const CustomLoader = () => (
    <Box sx={{width: '100%'}}>
      <LinearProgress />
    </Box>
  );

  const inputStyle =
    'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline';
  const submitButtonStyle =
    'bgCor border rounded w-full my-5 py-2  text-white appearance-none focus:outline-none focus:shadow-outline';
  const labelSyle = 'block text-white text-sm font-bold mb-2';
  const inputStyleForm1 =
    '  relative m-0 -mr-0.5 block w-[1px] min-w-0 flex-auto rounded-l border py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline';
  const submitButton1Style =
    'z-[4] bgCor inline-block rounded-r bg-cyan-100 px-6 pb-2 pt-2.5  font-medium uppercase leading-normal text-white focus:outline-none focus:shadow-outline';

  const [f, setF] = useState(false);

  const columns = [
    ,
    {
      name: 'Doctor Name',
      selector: (row) => row.doctorName,
      sortable: true,
    },
    {
      name: 'Medication',
      selector: (row) => row.medicationInfo.name,
      sortable: true,
    },
    {
      name: 'Quantity',
      selector: (row) => row.quantity,
      sortable: true,
    },

    {
      name: 'Due Date',
      selector: (row) =>
        new Date(row.refillPolicy.dueDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }),
      sortable: true,
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token'); // get auth token from localStorage
    const userId = searchParams.get('userId');

    fetch(
      'http://127.0.0.1:3030/pharmacy-0x2/api/patientHistory/get-patient-prescription-info',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userId,
        }),
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response error');
        }
        return res.json();
      })
      .then((data) => {
        setHistoryItems(data.prescription);
        setUserInfo(data.userInfo);
        setF(true);
        setPending(false);
        console.log(historyItems);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
      });
  }, [f]);

  function fillDate(data) {
    if (data.filledInfo.length == 0) {
      return 'Not filled';
    }
    return new Date(
      data.filledInfo[data.filledInfo.length - 1].filledDate
    ).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  function expDate(data) {
    if (data.filledInfo.length == 0) {
      return 'Not filled';
    }
    return new Date(
      data.filledInfo[data.filledInfo.length - 1].batchInfo.expirationDate
    ).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  const handleGoToInvPage = (e) => {
    e.preventDefault();
    router.push('/pages/settings/patients/');
  };
  const ExpandedComponent = ({data}) => (
    <div>
      <form
        style={{backgroundColor: 'rgb(51,102,153,255)'}}
        className="max-w-[800px] w-full mx-auto bg-transparent p-4 rounded border border-blue-500"
      >
        <h3>Prescription Info</h3>
        <hr className="mb-2" />
        <div className="w-full md:flex">
          <div className="w-full mx-2">
            <label className={labelSyle}>Delivered By</label>
            <input
              type="text"
              className={inputStyle}
              value={data.deliveredBy}
              disabled
            />
          </div>
          <div className="w-full mx-2">
            <label className={labelSyle}>Dosage</label>
            <input
              type="text"
              className={inputStyle}
              value={data.dosage}
              disabled
            />
          </div>
          <div className="w-full mx-2">
            <label className={labelSyle}>ID</label>
            <input
              type="text"
              className={inputStyle}
              value={data._id}
              disabled
            />
          </div>
        </div>
        <h3>Medication Info</h3>
        <hr className="mb-2" />
        <div className="w-full md:flex">
          <div className="w-full mx-2">
            <label className={labelSyle}>Name</label>
            <input
              type="text"
              className={inputStyle}
              value={data.medicationInfo.name}
              disabled
            />
          </div>
          <div className="w-full mx-2">
            <label className={labelSyle}>Manufacturer</label>
            <input
              type="text"
              className={inputStyle}
              value={data.medicationInfo.manufacturer}
              disabled
            />
          </div>
          <div className="w-full mx-2">
            <label className={labelSyle}>Location</label>
            <input
              type="text"
              className={inputStyle}
              value={data.medicationInfo.location}
              disabled
            />
          </div>
        </div>
        <div className="w-full md:flex">
          <div className="w-full mx-2">
            <label className={labelSyle}>Description</label>
            <input
              type="text"
              className={inputStyle}
              value={data.medicationInfo.description}
              disabled
            />
          </div>
          <div className="w-full mx-2">
            <label className={labelSyle}>Price</label>
            <input
              type="text"
              className={inputStyle}
              value={data.medicationInfo.price}
              disabled
            />
          </div>
        </div>
        <h3>Latest Filled Info</h3>
        <hr className="mb-2" />
        <div className="w-full md:flex">
          <div className="w-full mx-2">
            <label className={labelSyle}>Filled Date</label>
            <input
              type="text"
              className={inputStyle}
              value={fillDate(data)}
              disabled
            />
          </div>
          <div className="w-full mx-2">
            <label className={labelSyle}>Batch Used</label>
            <input
              type="text"
              className={inputStyle}
              value={
                data.filledInfo.length > 0
                  ? data.filledInfo[data.filledInfo.length - 1].batchInfo
                      .barcode
                  : 'Not filled'
              }
              disabled
            />
          </div>
          <div className="w-full mx-2">
            <label className={labelSyle}>Batch Exp Date</label>
            <input
              type="text"
              className={inputStyle}
              value={expDate(data)}
              disabled
            />
          </div>
        </div>
      </form>
    </div>
  );

  return (
    <div className=" px-5 text-white">
      <button
        className="top-5 left-0 m-2 px-4 py-2 bgCor text-white rounded absolute"
        onClick={handleGoToInvPage}
      >
        Patient List
      </button>
      <h3 className="my-5">
        Current Patient: {f ? `${userInfo.name} (${userInfo.email})` : ''}
      </h3>

      <DataTable
        title={f ? `${userInfo.name}'s Prescription History ` : ''}
        columns={columns}
        data={historyItems}
        pagination
        expandableRows
        expandableRowsComponent={ExpandedComponent}
        progressPending={pending}
        progressComponent={<CustomLoader />}
      ></DataTable>
    </div>
  );
}
