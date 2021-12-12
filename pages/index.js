import React, { useState, useEffect } from 'react';
export default function Home() {
  const [username,setUserName]=useState('')
  const [password,setPassword] = useState('')
  const [rememberme,setRememberMe] = useState(false)
  useEffect(()=>{
    let username = getCookie('sarb_username')
    let password = getCookie('sarb_password')
    if(username!='' && password!=''){
      setUserName(username)
      setPassword(password)
      setRememberMe(true)
    }
  },[])
  return (
    <div className="login">
    <div className="form">
      <form className="login-form" onSubmit={ handleFormSubmission } >
        <div className="login-text">Login</div>
        <input type="text" id="username" placeholder="username" onChange={(e)=>{setUserName(e.target.value)}} value={username} required/>
        <input type="password" id="password"  placeholder="password" onChange={(e)=>{setPassword(e.target.value)}} value={password} required />
        <button>login</button>
        <div className="rememberme"><input type="checkbox" id="rememberme" checked={rememberme} onChange={(e)=>{setRememberMe(!rememberme)}}/> <label htmlFor="rememberme">Remember me</label></div>
      </form>  
    </div>
  </div>
  )
}

async function handleFormSubmission(event){
  event.preventDefault()
  let username = event.target.username.value
  let password = event.target.password.value
  if(event.target.rememberme.checked){
    window.document.cookie=`sarb_username=${username}`; 
    window.document.cookie=`sarb_password=${password}`; 
  }
  else{
    document.cookie = "sarb_username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "sarb_password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
  var data = {
    username,
    password
  }
  const res = await fetch('/api/login',{
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })
  const result = await res.json()
  if(result.success == 'true'){
    window.document.cookie=`sarb_ref_id=${result.data.ref}`; 
    window.document.cookie=`sarb_sessid=${result.data.sessid}`; //Need to set Max age for session based on session_expiry parameter
   window.location.href='/reports'
  }else{
    alert('Wrong Username or Password')
  }

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