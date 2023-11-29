"use client";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker"
import {Bar} from 'react-chartjs-2';
import { CategoryScale, Chart, LinearScale, BarElement } from "chart.js";

import "react-datepicker/dist/react-datepicker.css";

export default function Reports() {

    const [transactionData,  setTransactionData]  = useState();
    const [overCounterData,  setOverCounterData]  = useState();
    const [prescriptionData, setPrescriptionData] = useState();
    const [overCounterObj,   setOverCounterObj]   = useState();
    const [prescriptionObj,  setPrescriptionObj]  = useState();
    const [avgSales, setAvgSales] = useState(0); 
    const [state, setState] = useState({
      labels: [],
      datasets: []
    }); 
    // Setup Datepicker 
    Chart.register(CategoryScale);
    Chart.register(LinearScale);
    Chart.register(BarElement);

    const currentDate = new Date(); 
    currentDate.setMonth(currentDate.getMonth()-3);
    const [startDate1, setStartDate1] = useState(currentDate);
    const [startDate2, setStartDate2] = useState(new Date());

    // Needed in useEffect
    function dateRange(startDate, endDate) {
      var start      = startDate.split('/');
      var end        = endDate.split('/');
      var startYear  = parseInt(start[2]);
      var endYear    = parseInt(end[2]);
      var dates      = [];

      for(var i = startYear; i <= endYear; i++) {
        var endMonth = i != endYear ? 11 : parseInt(end[0]) - 1;
        var startMon = i === startYear ? parseInt(start[0])-1 : 0;
        for(var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j+1) {
          var month = j+1;
          var displayMonth = month < 10 ? '0'+month : month;
          dates.push([displayMonth, i].join('/'));
        }
      }
      return dates;
    }

    // Make call to get all reports 
    useEffect( () => {
      const token = localStorage.getItem("token"); // get auth token from localStorage
      fetch("http://127.0.0.1:3030/pharmacy-0x2/api/reports/generateFinance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // include bearer token in the Autho header
        },
        body: JSON.stringify({
          startDate: String(startDate1),
          endDate: String(startDate2) 
        })
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response error");
          }
          return res.json();
        })
        .then((data) => {
          const tempTransactionData = data.filter((item) => {return item.status === "paid"}); 
          setTransactionData(tempTransactionData);

          let overCounterDataArray = []; let prescriptionDataArray = [];
          let overCounterObjArray  = []; let prescriptionObjArray  = [];  
          tempTransactionData.forEach(transaction => {
            overCounterObjArray.push(transaction.OverTheCounterItems);
            prescriptionObjArray.push(transaction.PrescriptionItems);
            overCounterDataArray.push(
              transaction.OverTheCounterItems.reduce((n, {price}) => n + price, 0));
            prescriptionDataArray.push(
              transaction.PrescriptionItems.reduce((n, {price}) => n + price, 0)); 
          })
          setOverCounterData(overCounterDataArray); 
          setPrescriptionData(prescriptionDataArray);
          setOverCounterObj(overCounterObjArray);
          setPrescriptionObj(prescriptionObjArray);
    
          let overCounterGraphDataArray  = []; 
          let prescriptionGraphDataArray = [];
          let totalSalesForAverage       = [];
          let monthYearDict = {}; 
          const dateRangeArr = dateRange(startDate1.toLocaleDateString(), startDate2.toLocaleDateString()); 
          for(var i = 0; i < dateRangeArr.length; i++){
            monthYearDict[dateRangeArr[i]] = i;
            overCounterGraphDataArray.push(0);
            prescriptionGraphDataArray.push(0);
            totalSalesForAverage.push(0); 
          }
          for(let i = 0; i < tempTransactionData.length; i++){
            const transactionDate = new Date(tempTransactionData[i].timestamp);
            const transactionDateStr = String(transactionDate.getMonth()) + '/' 
                                     + String(transactionDate.getFullYear());
            if ( transactionDate >= startDate1 && transactionDate <= startDate2) {
                console.log(transactionDateStr)
                overCounterGraphDataArray[monthYearDict[transactionDateStr]]  += overCounterDataArray[i];
                prescriptionGraphDataArray[monthYearDict[transactionDateStr]] += prescriptionDataArray[i];
                totalSalesForAverage[monthYearDict[transactionDateStr]] += overCounterDataArray[i] + prescriptionDataArray[i]; 
            }
          }
          
          const average = array => array.reduce((a, b) => a + b) / array.length;
          setAvgSales(Math.round(average(totalSalesForAverage) * 100) / 100);

          setState({
            labels: dateRangeArr,
            datasets: [
              {
                label: 'OverTheCounterItems',
                backgroundColor: '#1478BD',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 2,
                data: overCounterGraphDataArray
              },
              {
                label: 'PrescriptionItems',
                backgroundColor: '#ff721e',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 2,
                data: prescriptionGraphDataArray
              }
            ]
          })
          console.log(monthYearDict)       
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
      }, []);

      const updateGraph = (newDate, dateNum) => {
        let overCounterGraphDataArray  = []; 
        let prescriptionGraphDataArray = [];
        let totalSalesForAverage       = [];
        let monthYearDict = {}; 
        const start = !dateNum ? newDate : startDate1; 
        const end   = dateNum  ? newDate : startDate2; 
        const dateRangeArr = dateRange(start.toLocaleDateString(), end.toLocaleDateString()); 
        console.log(dateRangeArr)
        for(var i = 0; i < dateRangeArr.length; i++){
          monthYearDict[dateRangeArr[i]] = i;
          overCounterGraphDataArray.push(0);
          prescriptionGraphDataArray.push(0);
          totalSalesForAverage.push(0); 
        }
        for(let i = 0; i < transactionData.length; i++){
          const transactionDate = new Date(transactionData[i].timestamp);
          const transactionDateStr = String(transactionDate.getMonth()) + '/' 
                                   + String(transactionDate.getFullYear());
          if ( transactionDate >= startDate1 && transactionDate <= startDate2) {
              overCounterGraphDataArray[monthYearDict[transactionDateStr]] +=  overCounterData[i];
              prescriptionGraphDataArray[monthYearDict[transactionDateStr]] += prescriptionData[i];
              totalSalesForAverage[monthYearDict[transactionDateStr]] += prescriptionData[i] + overCounterData[i]; 
          }
        }
        
        const average = array => array.reduce((a, b) => a + b) / array.length;
        setAvgSales(Math.round(average(totalSalesForAverage) * 100) / 100);

        setState({
          labels: dateRangeArr,
          datasets: [
            {
              label: 'OverTheCounterItems',
              backgroundColor: '#1478BD',
              borderColor: 'rgba(0,0,0,1)',
              borderWidth: 2,
              data: overCounterGraphDataArray
            },
            {
              label: 'PrescriptionItems',
              backgroundColor: '#ff721e',
              borderColor: 'rgba(0,0,0,1)',
              borderWidth: 2,
              data: prescriptionGraphDataArray
            }
          ]
        })
      }

  return (
    <div>
        {/* Select Date */}
        <div className="grid place-items-center">
            <div className="center m-2 p-2 text-white">
                <b>Select Timeframe:</b> 
            </div>
          <div className="flex">
              <div className="center m-2 p-2 text-white">
                  <b>Start Date:</b> 
              </div> 
              <div className="m-2 p-2">
                  <DatePicker selected={startDate1} 
                              onChange={(date) => {
                                setStartDate1(date);
                                updateGraph(date, 0);
                                }} />
              </div>
              <div className="center m-2 p-2 text-white">
                  <b>End Date:</b> 
              </div> 
              <div className="m-2 p-2">
                  <DatePicker selected={startDate2} 
                              onChange={(date) => {
                                setStartDate2(date);
                                updateGraph(date, 1);
                                }} />
              </div>
          </div>
          <h1 className="m-5 p-2">
            Monthly Sales
          </h1>
          <div className="center m-2 p-2 text-white">
              <b>Average Sales in Timeframe: {avgSales}</b>
          </div>
          <div className="bg-white flex border" 
          style={{height:'500px', width:'1000px', right:'20px', border: 'solid-2px-black'}}
          >
              <Bar 
                  data={state}
                  options={{
                    title:{
                      display:true,
                      text:'Average Rainfall per month',
                      fontSize:20
                    },
                    legend:{
                      display:true,
                      position:'top'
                    },
                  }}
              />
          </div>

          <div className="flex">
            <div className="center m-2 p-2 text-white">
              <b>Legend: </b>
            </div>
            <div className="center m-2 p-2 text-white">
              Over The Counter Items
            </div>
            <div className="center m-2 p-2 text-white border" style={{backgroundColor:'#1478BD'}}></div>
            <div className="center m-2 p-2 text-white">
              Prescription Items
            </div>
            <div className="center m-2 p-2 text-white border" style={{backgroundColor:'#ff721e'}}></div>
          </div>
        </div>

        </div>
        
  );
}
