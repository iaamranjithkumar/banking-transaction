import React, { useState } from 'react';
import ReactTable from "react-table-6";
import CsvDownload from 'react-json-to-csv'
import "react-table-6/react-table.css";
import loaderImage from '../images/loader.gif'
import Image from 'next/image'
ReconDetails.getInitialProps = async (ctx) => {
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
        const res = await fetch('https://money-transfer-2021.vercel.app'+'/api/recon',{
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
export default function ReconDetails() {
    const [currentDate, setcurrentDate] = useState('');
    const [allReconDetails,setReconDetails] = useState('')
    const [error,setError] = useState('')
    const [loader,setLoader] = useState(false)
    const columns = []
   const state = {setReconDetails,setReconDetails,setcurrentDate,setError,setLoader, currentDate}
   var today=new Date().toISOString().split("T")[0];
    if(allReconDetails && allReconDetails.length)
     {
       Object.keys(allReconDetails[0]).forEach((x,i)=>{
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
                            <input type="date" value={currentDate} max={today} onChange={(e)=>{oncurrentDateChange(e.target.value,state)}}></input>
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
                    {!loader && allReconDetails &&allReconDetails!='' && allReconDetails.length && <div><div className="recon-details">
                       
                    </div><div className="recon-details-table"><br />
                            <h2>Accounting Details</h2>
                            <div className="result">
                                Result: <strong>{allReconDetails.length}</strong> Reports
                            </div>
                            <div className="table-rs">
                            <ReactTable
                                data={allReconDetails}
                                columns={columns}
                                defaultPageSize={10} />
                                </div>
                                <div className="recon-csv-download">
                               <CsvDownload data={allReconDetails}>Click here to Download</CsvDownload>
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
    const result = await GetReconDetails({startDate:currentDate, endDate:currentDate})
    state.setLoader(false)
    if(result.ReconDetails){
        state.setReconDetails(result.ReconDetails)
        
    }else{
        state.setReconDetails([])
        state.setError('No data found on')
    }
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