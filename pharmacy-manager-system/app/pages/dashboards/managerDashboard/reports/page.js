"use client";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker"
import {Bar} from 'react-chartjs-2';
import { CategoryScale, Chart, LinearScale, BarElement } from "chart.js";

import "react-datepicker/dist/react-datepicker.css";

export default function Reports() {

    // TODO: Remove: This is just to test functionality 
    const purchaseHistory = [
        [
            {
                PrescriptionItems: [
                    {}
                ],
                OverTheCounterItems: [
                    {}
                ]
            }
        ],
        [
            {
                PrescriptionItems: [],
                OverTheCounterItems: []
            }
        ]
    ]

    // Setup Datepicker 
    Chart.register(CategoryScale);
    Chart.register(LinearScale);
    Chart.register(BarElement);

    const currentDate = new Date(); 
    currentDate.setMonth(currentDate.getMonth()-1);
    const [startDate1, setStartDate1] = useState(currentDate);
    const [startDate2, setStartDate2] = useState(new Date());

    const state = {
        labels: ['January', 'February', 'March',
                 'April', 'May'],
        datasets: [
          {
            label: 'Rainfall',
            backgroundColor: '#1478BD',
            borderColor: 'rgba(0,0,0,1)',
            borderWidth: 2,
            data: [65, 59, 80, 81, 56]
          }
        ]
      }

    // TODO: Make call to get all reports 


  return (
    <div>
        {/* Select Date */}
        <div className="flex">
            <div className="center m-2 p-2 text-white">
                <b>Select Timeframe:</b> 
            </div>
            <div className="m-2 p-2">
                <DatePicker selected={startDate1} 
                            onChange={(date) => setStartDate1(date)} />
            </div>
            <div className="m-2 p-2">
                <DatePicker selected={startDate2} 
                            onChange={(date) => setStartDate2(date)} />
            </div>
        </div>
        {/* <div className="bg-white"> */}
            <Bar 
                 data={state}
                 height={20}
                 width={10}
                 options={{
                   title:{
                     display:true,
                     text:'Average Rainfall per month',
                     fontSize:20
                   },
                   legend:{
                     display:true,
                     position:'right'
                   },
                //    maintainAspectRatio: false
                 }}
            />
        {/* </div> */}
        </div>
        
  );
}
