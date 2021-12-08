import React, { useState } from 'react';
import ReactTable from "react-table-6";
import CsvDownload from 'react-json-to-csv'
import "react-table-6/react-table.css";
Transactions.getInitialProps = async (ctx) => {
    if(ctx&&ctx.req&&ctx.req.headers){
        if(ctx.req.headers.cookie){
            let sessionId= getCookie('sarb_sessid',ctx.req.headers.cookie)
            if(sessionId && sessionId!=''){
        var currentDate = new Date();
            let body ={
                'session_id': getCookie('sarb_sessid',ctx.req.headers.cookie),
                data:{ "ref": getCookie('sarb_ref_id', ctx.req.headers.cookie),
                "data": {
                    "year": currentDate.getFullYear(),
                    "month": currentDate.getMonth()+1,
                    "date": currentDate.getDate()
                }
                }
            }
        return await GetTransactionDetails(body);
     
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
else{
    ctx.res&& ctx.res.writeHead('302',{
        Location: '/'
      })
      ctx.res.end();
  }
}

    async function GetTransactionDetails(body){
        const res = await fetch('https://banking-transaction.vercel.ap'+'/api/transaction',{
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
        return {transactions: data.data }
      }
export default function Transactions({transactions, error}) {
    var today = new Date().toISOString().split('T')[0]
    const [currentDate, setDate] = useState(today);
    const [allTransactions,setTransactions] = useState(transactions)
    const [selectedOperation,setOperation] = useState("ALL")
    const [status,setStatus] = useState("ALL")
    const [transationDetails, setTransationDetails] = useState(transactions && transactions.detailedReport)
    const columns = []
   const state = {setTransactions,setTransationDetails,setDate, setStatus, setOperation,status,selectedOperation,status,allTransactions,transationDetails}
    if(transationDetails && transationDetails.length)
     {
       Object.keys(transationDetails[0]).forEach((x,i)=>{
      columns.push({
        Header: x,
        accessor: x
      })
    })
  }
  const notInclude= ["code","message","seqno","ref","csv","detailedReport","operations","status"]
    return (
        <div className="transaction">
            <div className="transaction-data">
            <h2>Select Date</h2>
                <input type="date" value={currentDate} onChange={(e)=>{onDateChange(e.target.value,state)}}></input>
                {transationDetails && <div className = "transaction-details">
                <div className = "transaction-summary">
                <h2>Transactions Summary</h2>
                    <div class="transaction-container">                    
                    <div className = {`total`}>
                        <span className="total-key"><h4>{`Key`}</h4></span> <span className="total-count"><h4>{`Total Count`}</h4></span> <span className="total-rand"><h4>{`Total Rand Value`}</h4></span>  <span  className="total-usd"><h4>{`Total USD Value`}</h4></span> 
                    </div>
                    {Object.keys(allTransactions).map(x=>{
                        if(!notInclude.includes(x)){
                            if(x === 'hashtotal'){
                                return(<div key={x} className = {`total`}>
                                <span className="totalKey">{x}</span> <span className="total-count">{allTransactions[x].total_records}</span>  <span className="total-rand">{allTransactions[x].hashtotal_rand_value}</span>  <span  className="total-usd">{allTransactions[x].hashtotal_usd_value}</span> 
                                </div>)
                            }
                            else{
                        return(<div key={x} className = {`total`}>
                                <span className="totalKey">{x}</span> <span className="total-count">{allTransactions[x].total}</span>  <span className="total-rand">{allTransactions[x].total_rand_value}</span>  <span  className="total-usd">{allTransactions[x].total_usd_value}</span> 
                        </div>
                    )}}})}
                    </div>
                    </div>
                    <div className="transaction-details-table"><br/>
                    <h2>Transactions Details</h2>
                    <div className="filters">
                        <span>
                    <label>Select Operation</label>
                    <select onChange={(e)=>{onOperationChange(e.target.value, state)}}>
                         <option value="ALL" selected={selectedOperation === "ALL"}>ALL</option>
                            {allTransactions.operations && allTransactions.operations.map(x=>{
                                return(<option key={x} value={x} selected={selectedOperation == x} >{x}</option>)
                            })}
                    </select>
                    </span>
                    <span>
                    <label>Select Status</label>
                    <select onChange={(e)=>{onStatusChange(e.target.value, state)}}>
                      <option value="ALL" selected={status === "ALL"}>ALL</option>
                            {allTransactions.status && allTransactions.status.map(x=>{
                                return(<option key={x} value={x} selected={selectedOperation == x} >{x}</option>)
                            })}
                    </select>
                    </span>
                    <a href="#"><CsvDownload data={transationDetails}>Click here to Download</CsvDownload></a>
                    </div>
                    <div className="result">
                        Result: <strong>{transationDetails.length}</strong> Transactions
                        </div>
                    <ReactTable
                        data={transationDetails}
                        columns={columns} 
                        defaultPageSize={5}/>
                        </div>
                </div>}
        </div> 
        </div>
    )
  }

  function onOperationChange(value, state){
      state.setOperation(value)
      state.setTransationDetails(state.allTransactions.detailedReport.filter(x=>(value =="ALL" || x.Operation == value) && (state.status && state.status !='ALL'?state.status == x.Status:true)))
  }
  function onStatusChange(value, state){
    state.setStatus(value)
    state.setTransationDetails(state.allTransactions.detailedReport.filter(x=>(value =="ALL" || x.Status == value) && (state.selectedOperation && state.selectedOperation !='ALL'?state.selectedOperation == x.Operation:true)))
}


  async function onDateChange(value,state){
      state.setDate(value)
    let dvalue = value.split('-')
    let body ={
        'session_id': getCookie('sarb_sessid'),
         data:{ "ref": getCookie('sarb_ref_id'),
          "data": {
              "year": dvalue[0],
              "month": dvalue[1],
              "date": dvalue[2]
          }
        }
      }
      state.setOperation("ALL")
      state.setStatus("ALL")
      const data = await GetTransactionDetails(body);
      state.setTransactions(data.transactions);
      state.setTransationDetails(data.transactions.detailedReport)
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