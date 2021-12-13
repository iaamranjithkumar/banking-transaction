import Transactions from "./transactions";
import React, { useState } from 'react';
import ReconDetails from "./recon";
import RunMatch from '../components/runMatch'

Reports.getInitialProps = async (ctx) => {
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
        let {transactions, error} = await GetTransactionDetails(body);
        if(error && error.code === 'ERR_SESSION_EXPD'){
            ctx.res&& ctx.res.writeHead('302',{
                Location: '/'
              })
              ctx.res.end();
        }else{
         return {transactions, error}  
        }
     
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
export default function Reports({transactions, error}) {
    const [selectedMenu,setMenu]=useState('transaction')
    return (
        <div className="reports">
            <div className="container">
            <div className="row">
                <div className="navigation">
                <header className='navbar'>
                    <div className='navbar__title'>Reconciliation Module</div>
                    <div className={selectedMenu === 'transaction'?'navbar__item active':'navbar__item'} onClick={()=>{setMenu('transaction')}}>Reporting System</div>
                    <div className={selectedMenu === 'recon'?'navbar__item active':'navbar__item'} onClick={()=>{setMenu('recon')}}>Accounting System</div>
                    <div className={selectedMenu === 'run-match'?'navbar__item active':'navbar__item'} onClick={()=>{setMenu('run-match')}}>Run Match</div>
                    <div className='navbar__item' onClick={Logout}>Logout</div>        
                </header>
                </div>
                <div className="main-content">
                    {selectedMenu === 'transaction' && <Transactions transactions={transactions} error={error}/>}
                    {selectedMenu === 'recon' && <ReconDetails />}
                    {selectedMenu === 'run-match' && <RunMatch />}
                </div>
            </div>
            </div>
        </div>
    )
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

  function getCookie(cname,cookies=null) {
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

  function Logout(){
    document.cookie = "sarb_ref_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "sarb_sessid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href='/'
  }