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
            name: "Doctor Name",
            selector: (row) => row.doctorName,
            sortable: true,
        },
        {
            name: "Quantity",
            selector: (row) => row.quantity,
            sortable: true,
        },
        {
            name: "Due Date",
            selector: (row) => row.refillPolicy.dueDate,
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
                console.log(historyItems);
            })
            .catch((error) => {
                console.error("Fetch error:", error);
            });
    }, [f]);

    console.log();

    const ExpandedComponent = ({ data }) => (
        <div>
            <form
                style={{ backgroundColor: "rgb(51,102,153,255)" }}
                className="max-w-[800px] w-full mx-auto bg-transparent p-4 rounded border border-blue-500"
            >
                <h3> Prescription Info </h3>

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
                    {/* <div className="w-full mx-2">
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
                    </div>*/}
                </div>
                {/*
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
                            <option value="" style={{ display: 'none' }}>
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
                            <label style={{ color: 'gray', fontSize: '1.1em' }}>Yes</label>
                            <input
                                type="radio"
                                id="allowRefillYes"
                                name="allowRefill"
                                value="Yes"
                                checked={formData.allowRefill === 'Yes'}
                                onChange={handleChange}
                                style={{ width: '2em' }}
                            />
                            <label style={{ color: 'gray', fontSize: '1.1em' }}>No</label>
                            <input
                                type="radio"
                                id="allowRefillNo"
                                name="allowRefill"
                                value="No"
                                checked={formData.allowRefill === 'No'}
                                onChange={handleChange}
                                style={{ width: '2em' }}
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
                </div> */}
            </form>
        </div>
    );


    return (
        <div className=" px-5 text-white">
            <DataTable
                title="Patient History"
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
