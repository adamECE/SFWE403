'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DataTable, { ExpanderComponentProps } from "react-data-table-component";
export default function ViewPatientMedicineHistory({ historyItems, setHistoryItems }) {
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

   
   
    const [f, setF] = useState(false);
    
    const columns = [
        ,
        {
            name: "DR Name",
            selector: (row) => row.doctorName,
            sortable: true,
        },
        {
            name: "quantity",
            selector: (row) => row.quantity,
            sortable: true,
        }
    
    ];


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
                    "userId": "650bbd1d3ccdb74624e5be72"
                }),
            }
        )
            .then((res) => {
                if (!res.ok) {
         
                    throw new Error("Network response error");
                }
                return res.json();
            })
            .then((data) => {
                setHistoryItems(data);
                setF(true);
                console.log(historyItems)
            })
            .catch((error) => {
                console.error("Fetch error:", error);
            });
    }, [f]);

    const ExpandedComponent = ({ data }) => (
    <div>
    
            <h3 className=" px-5 text-black"> Other info here</h3>
      <hr /> <hr />
    </div>
  );


    return (
        <div className=" px-5 text-white">
        <DataTable
          title="Patient Hist List"
          columns={columns}
          data={historyItems}
          pagination
          expandableRows
           expandableRowsComponent={ExpandedComponent}
        //   progressPending={pending}
        //   progressComponent={<CustomLoader />}
        ></DataTable>
      </div>
    )
}
