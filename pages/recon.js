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
        const res = await fetch('https://banking-transaction.vercel.app/'+'/api/recon',{
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
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [formError,setFormError]=useState('');
    const [allReconDetails,setReconDetails] = useState('')
    const [error,setError] = useState('')
    const [loader,setLoader] = useState(false)
    const columns = []
   const state = {setReconDetails,setReconDetails,setStartDate, setEndDate,setError, setFormError,setLoader, startDate,endDate}
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
                            <label>Start Date</label>
                            <input type="date" value={startDate} onChange={(e)=>{onStartDateChange(e.target.value,state)}}></input>
                        </div>
                        <div className="recon-inputs-checkbox">
                            <label>End Date</label>
                            <input type="date" value={endDate} onChange={(e)=>{onEndDateChange(e.target.value,state)}}></input>
                        </div>
                        <div className="recon-inputs-submit">
                        <button onClick={()=>{onSubmit(state)}}>Get Report</button>
                        </div>
                    </div>
                    {formError && formError!='' && <div className="form-error">{formError}</div>}
                    </div>
                    {<div className = "recon-details">
                      {!loader && error && error!='' &&<div className="recon-error">
                    <h3>{error} {state.startDate} and {state.endDate}</h3>
                    </div>}

                    {loader && <div className="loader">
                        <Image src={loaderImage} alt="loading...." width="100" height="100"></Image>
                        </div>}
                    {!loader && allReconDetails &&allReconDetails!='' && allReconDetails.length && <div><div className="recon-details">
                       
                    </div><div className="recon-details-table"><br />
                            <h2>ReconDetails</h2>
                            <div className="result">
                                Result: <strong>{allReconDetails.length}</strong> ReconDetails
                            </div>
                            <div className="table-rs">
                            <ReactTable
                                data={allReconDetails}
                                columns={columns}
                                defaultPageSize={5} />
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
  async function onStartDateChange(value,state){
    state.setStartDate(value)
    state.setError('')
    if(state.endDate != ''){
        let endDate = new Date(state.endDate)
        let startDate = new Date(value)
        if(startDate>endDate){
            state.setErro('StartDate should always be less than endDate.')
        }else{
            state.setFormError('')
        }
    }
  }

  async function onEndDateChange(value,state){
    state.setEndDate(value)
    state.setError('')
    if(state.startDate != ''){
        let startDate = new Date(state.startDate)
        let endDate = new Date(value)
        if(startDate>endDate){
            state.setFormError('StartDate should always be less than endDate.')
        }else{
            state.setFormError('')
        }
    }
}

async function onSubmit(state){
    if(state.startDate === '' && state.endDate === ''){
        state.setFormError('Select Start Date and End Date to get report')
    }
    else if(state.startDate === '' ){
        state.setFormError('Select Start Date to get report')
    } else if(state.endDate === '' ){
        state.setFormError('Select End Date to get report')
    }else if(new Date(state.startDate) > new Date(state.endDate) ){
        state.setFormError('StartDate should always be less than endDate.')
    }
    else{
        state.setFormError('')
        state.setLoader(true)
        const result = await GetReconDetails({startDate:getDateFormat(state.startDate), endDate:getDateFormat(state.endDate)})
        state.setLoader(false)
        if(result.ReconDetails){
        
            state.setReconDetails(result.ReconDetails)
            
        }else{
            state.setReconDetails([])
            state.setError('No data found between')
        }

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