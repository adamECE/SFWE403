import {useMemo, useState, useEffect} from 'react';
import UpdatePatient from './UpdatePatient';
import DataTable, {ExpanderComponentProps} from 'react-data-table-component';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import {useRouter} from 'next/navigation';
import Box from '@mui/material/Box';
import {BsTrash, BsPencilSquare} from 'react-icons/bs';
import {GiMedicinePills} from 'react-icons/gi';
import Swal from 'sweetalert2';
export default function RemovePatient({patientList, setPatientList}) {

  const inputStyle =
    'shadow appearance-none border rounded text-sm  w-full py-2 px-2 text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline';

  const labelSyle = 'block text-gray-500 text-sm font-bold mb-2';
  const router = useRouter();
  const [pat, setPat] = useState(false);
  const [patientInfo, setPatientInfo] = useState();
  const [showUpdatePatientForm, setShowUpdatePatientForm] = useState(false);
  const [isAutho, setIsAutho] = useState(false);
  const [pending, setPending] = useState(true);

  const CustomLoader = () => (
    <Box sx={{width: '100%'}}>
      <LinearProgress />
    </Box>
  );
  const columns = [
    ,
    {
      name: 'First Name',
      selector: (row) => row.firstName,
      sortable: true,
    },
    {
      name: 'Last Name',
      selector: (row) => row.lastName,
      sortable: true,
    },

    {
      name: 'Date Of Birth',
      cell: (param) => {
        return new Date(param.dateOfBirth).toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
      },
    },

    {
      name: 'Action',
      cell: (param) => {
        return (
          <>
            <Button onClick={() => handlePresciptionList(param)}>
              <GiMedicinePills size="30px" />
            </Button>
            <Button onClick={() => handleEdit(param)}>
              <BsPencilSquare size="20px" />
            </Button>

            {isAutho ? (
              <Button onClick={() => handleDelete(param)} color="error">
                <BsTrash size="20px" />
              </Button>
            ) : (
              ''
            )}
          </>
        );
      },
    },
  ];
  function handleEdit(e) {
    setPatientInfo(e);
    setShowUpdatePatientForm(true);
  }

  function handlePresciptionList(e) {
    router.push(`/pages/settings/patients/prescriptions?userId=${e._id}`);
  }

  const handleDelete = async (e) => {
    Swal.fire({
      title: ' Are you sure you want delete this patient account?',
      showDenyButton: true,
      confirmButtonText: 'YES',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');

          const response = await fetch(
            'http://127.0.0.1:3030/pharmacy-0x2/api/remove-patient',
            {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },

              body: JSON.stringify({
                email: e.email,
              }),
            }
          );
          if (response.ok) {
            const responseText = await response.text();
            Swal.fire(`${JSON.parse(responseText).message}`, '', 'success');
            // router.refresh();
          } else {
            const errorText = await response.text();
            Swal.fire(`${JSON.parse(errorText).error}`, '', 'error');
          }
        } catch (error) {
          console.error('error:', error);
        }
      } else if (result.isDenied) {
        // Swal.fire('Changes are not saved', '', 'info')
      }
    });
  };
  useEffect(() => {
    if (
      localStorage.getItem('role') == 'pharmacy manager' ||
      localStorage.getItem('role') == 'pharmacist'
    ) {
      setIsAutho(true);
    }

    const token = localStorage.getItem('token'); // get auth token from localStorage
    //setInventoryItems([inventoryData]) //for testing
    fetch('http://127.0.0.1:3030/pharmacy-0x2/api/patient-list', {
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
        setPatientList(data);
        console.log(pat);
        setPat(true);
        setPending(false);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
      });
  }, [pat]);

  const ExpandedComponent = ({data}) => (
    <div>
      <div className="w-full md:flex">
        <div className="w-auto my-2 flex-1 mx-3">
          <div className=" md:flex">
            <div className="w-auto mx-2 flex-1">
              <label className={labelSyle}>Insurance Information</label> <hr />
              <p className={inputStyle}>
                Policy Number: {data.insuranceInformation.policyNumber}
                <br />
                Provider: {data.insuranceInformation.provider}
              </p>
            </div>
            <div className="w-auto mx-2 flex-1">
              <label className={labelSyle}>Contact</label> <hr />
              <p className={inputStyle}>
                Email: {data.email} <br />
                Phone: {data.phoneNumber}
              </p>
            </div>
            <div className="w-auto mx-2 flex-1">
              <label className={labelSyle}>Address</label> <hr />
              <p className={inputStyle}>
                {data.address.streetName} <br />
                {data.address.city}, {data.address.state} {data.address.zipCode}
              </p>
            </div>
          </div>

          <hr />
        </div>
      </div>
      <hr /> <hr />
    </div>
  );

  return (
    <>
      {showUpdatePatientForm && (
        <UpdatePatient
          setShowUpdatePatientForm={setShowUpdatePatientForm}
          patientInfo={patientInfo}
        />
      )}
      <div className=" px-5 text-white">
        <DataTable
          title="Patient List"
          columns={columns}
          data={patientList}
          pagination
          expandableRows
          expandableRowsComponent={ExpandedComponent}
          progressPending={pending}
          progressComponent={<CustomLoader />}
        ></DataTable>
      </div>
    </>
  );
}
