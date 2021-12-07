export default function Home() {
  return (
    <div className="login">
    <div className="form">
      <form className="login-form" onSubmit={ handleFormSubmission } >
        <span className="material-icons">Login</span>
        <input type="text" id="username" placeholder="username" required/>
        <input type="password" id="password"  placeholder="password" required />
        <button>login</button>
      </form>  
    </div>
  </div>
  )
}

async function handleFormSubmission(event){
  event.preventDefault()
  var data = {
    username: event.target.username.value,
    password: event.target.password.value
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
   window.location.href='/transactions'
  }else{
    alert('Wrong Username or Password')
  }

}
