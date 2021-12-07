// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'
export default async function handler(req, res) {
  if(req.method === 'POST' && req.url === '/api/login')  {
    try{
      var headers={
        'USER': req.body.username,
        'PASS': req.body.password,
        'Content-Type': 'application/json'
      }
    let response = await axios.post('https://mgr.oneswitch.org/svsmgr/login',{
      "ref": "1234123412341234"
      },{
     headers
    })
    if(response.status == 200){
        
        res.status(200).json({ success: 'true', data: response.data })
    }
    else{
      res.status(200).json({ success: 'false', error:"Invalid User" })
    }
    }catch(err){
        console.log(err)
        res.status(500).json({success:false, error: 'Internal Server Error'})
    }

    
  }
}
