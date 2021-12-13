import React, { useState } from 'react';
import ReactTable from "react-table-6";
import CsvDownload from 'react-json-to-csv'
import "react-table-6/react-table.css";
import loaderImage from '../images/loader.gif'
import Image from 'next/image'
RunMatch.getInitialProps = async (ctx) => {
    if(ctx&&ctx.req&&ctx.req.headers){
        if(ctx.req.headers.cookie){
            let sessionId= getCookie('sarb_sessid',ctx.req.headers.cookie)
            if(!sessionId || sessionId==''){
                ctx.res&& ctx.res.writeHead('302',{
                    Location: '/'
                  })
                  ctx.res.end();
            }
            return {}
    }else{
        ctx.res&& ctx.res.writeHead('302',{
            Location: '/'
          })
          ctx.res.end();
    }
}
    else{
        ctx.res&& ctx.res.writeHead('302',{
            Location: '/'
          })
          ctx.res.end();
    }
}

async function GetReconDetails(body){
        const res = await fetch('https://money-transfer-2021.vercel.app/'+'/api/recon',{
            method: 'POST',
            body: JSON.stringify(body),
            headers:{
                'Content-Type': 'application/json',
            }
        })
        const data = await res.json()
      
        if (!data) {
          return {
              ReconDetails: null,
          }
        }
        if(data.error){
            return {error: {code:'ERR_NO_DATA',message:data.error, ReconDetails: null}}
        }
        return {ReconDetails: data.data }
      }
export default function RunMatch() {
    const [currentDate, setcurrentDate] = useState('');
    const [matchDetails,setMatchDetails] = useState('')
    const [allMatchDetails, setAllMatches] = useState('')
    const [selectedMatch, setMatchFilter]=useState('ALL')
    const [error,setError] = useState('')
    const [loader,setLoader] = useState(false)
    const columns = []
   const state = {setMatchDetails,setcurrentDate,setError,setLoader,setAllMatches,setMatchFilter, allMatchDetails, currentDate}
    if(allMatchDetails && allMatchDetails.length)
     {
       Object.keys(allMatchDetails[0]).forEach((x,i)=>{
      columns.push({
        Header: x,
        accessor: x
      })
    })
  }
    return (
        <div className="recon">
            <div className="recon-data">
                <div className="recon-select-form">
                    <div>
                        <div className="recon-inputs-checkbox">
                            <label>Select Date</label>
                            <input type="date" value={currentDate} onChange={(e)=>{oncurrentDateChange(e.target.value,state)}}></input>
                        </div>
                    </div>
                    </div>
                    {<div className = "recon-details">
                      {!loader && error && error!='' &&<div className="recon-error">
                    <h3>{error} {state.currentDate}</h3>
                    </div>}

                    {loader && <div className="loader">
                        <Image src={loaderImage} alt="loading...." width="100" height="100"></Image>
                        </div>}
                    {!loader && allMatchDetails &&allMatchDetails!='' && allMatchDetails.length && <div><div className="recon-details">
                       
                    </div><div className="recon-details-table"><br />
                            <h2>Accounting Details</h2>
                            <div className="result">
                                Result: <strong>{matchDetails.length}</strong> Reports
                            </div>
                            <div className="filters">
                                <span>
                                    <label>Select Match</label>
                                    <select onChange={(e) => { onMatchChange(e.target.value, state); } }>
                                        <option value="ALL" selected={selectedMatch === "ALL"}>ALL</option>
                                        <option value="YES" selected={selectedMatch === "YES"}>YES</option>
                                        <option value="NO" selected={selectedMatch === "NO"}>NO</option>
                                    </select>
                                </span>
                            </div>
                            <div className="table-rs">
                            <ReactTable
                                data={matchDetails}
                                columns={columns}
                                defaultPageSize={5} />
                                </div>
                                <div className="recon-csv-download">
                               <CsvDownload data={matchDetails}>Click here to Download</CsvDownload>
                                </div>
                        </div>
                        </div>
                    }
            </div> 
            }
        </div>
        </div>
    )
  }
  async function oncurrentDateChange(value,state){
    state.setcurrentDate(value)
    state.setError('')
    state.setLoader(true)
    const currentDate = getDateFormat(value)
    const dvalue = value.split('-')
    let body ={
        'session_id': getCookie('sarb_sessid'),
         data:{ "ref": getCookie('sarb_ref_id'),
          "data": {
              "year": dvalue[0],
              "month": dvalue[1],
              "date": dvalue[2],
              "run_match": 1
          }
        }
      }
      const result = await GetReconDetails({startDate:currentDate, endDate:currentDate})
      const transactionDetails = await GetTransactionDetails(body)
      
      if(result.ReconDetails){
        if(transactionDetails.transactions && transactionDetails.transactions.detailedReport && transactionDetails.transactions.detailedReport.length){
            let report = transactionDetails.transactions.detailedReport;
            const columns=[]
            Object.keys(result.ReconDetails[0]).forEach((x)=>{
                columns.push(x)
              })
              result.ReconDetails.forEach(data=>{
                  let match = report.find(x=>x.RemittanceId === data.RemittanceId)
                  if(match){
                    let mat = 'YES';
                    columns.forEach(col=>{
                        if(match[col]!=data[col]){
                            mat='NO'
                        }
                    })
                    data.Match = mat
                  }
                  else{
                      data.Match = 'NO'
                  }
              })
              state.setMatchDetails(result.ReconDetails)
              state.setAllMatches(result.ReconDetails)
              state.setError('')
        }
        else{
            result.ReconDetails.forEach(data=>{
             data.Match = 'NO'
            })
            state.setMatchDetails(result.ReconDetails)
            state.setAllMatches(result.ReconDetails)
            state.setError('')
        }
      }else{
        state.setMatchDetails(null)
        state.setAllMatches(null)
        state.setError('No Data found from Accounting System')
      }
      state.setMatchFilter('ALL')
      state.setLoader(false)
    
  }

  async function GetTransactionDetails(body){
    const res = await fetch('https://money-transfer-2021.vercel.app/'+'/api/transaction',{
        method: 'POST',
        body: JSON.stringify(body),
        headers:{
            'Content-Type': 'application/json',
        }
    })
    const data = await res.json()
  
    if (!data) {
      return {
          transactions: null,
      }
    }
    if(data.data.code == 11){
        return {error: {code:'ERR_SESSION_EXPD',message:'Session Expired !! Login Again', transactions: null}}
    }
    return {transactions: data.data }
  }


function getCookie(cname,cookies) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(cookies || window.document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  function getDateFormat(date){
      const d = new Date(date)
      return `${d.getDate()}-${getMonthName(d.getMonth())}-${d.getFullYear()}`
  }
  function getMonthName(month){
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return monthNames[month]
  }

  function onMatchChange(value, state){
    state.setMatchFilter(value)
    if(value === 'ALL'){
        state.setMatchDetails(state.allMatchDetails)
    }else{
        state.setMatchDetails(state.allMatchDetails.filter(x=>x.Match ==value))
    }
    
}