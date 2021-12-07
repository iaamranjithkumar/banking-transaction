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
  const res = await fetch(process.env.NEXT_PUBLIC_site_url || 'http://localhost:3000'+ '/api/login',{
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })
  console.log('here')
  const result = await res.json()
  console.log(result)
  if(result.success == 'true'){
    window.document.cookie=`sarb_ref_id=${result.data.ref}`; 
    window.document.cookie=`sarb_sessid=${result.data.sessid}`; //Need to set Max age for session based on session_expiry parameter
   window.location.href='/transactions'
  }else{
    alert('Wrong Username or Password')
  }

}
