import axios from 'axios'
import * as csvtojson from 'csvtojson'

export default async function handler(req, res) {
  if(req.method === 'POST' && req.url === '/api/recon'){
        try{
            let reqBody = req.body
            let reconData ={
                "security": {
                    "login": "SHOP2SHOP",
                    "password": "SHOP2SHOP"
                },
                "startdate": reqBody.startDate,
                "enddate": reqBody.endDate
            }
            let response = await axios.post('http://167.114.24.248:96/s2s/getreconfile',reconData,{
                headers:{
                    'Content-Type': 'application/json'
                },
                
            })
            var result = response.data
            if(result){
                if(result&& result.err){
                    console.log(result.err)
                    res.status(200).json({success:false,error: 'No data found to export.'})
                }
                else{
               csvtojson().fromString(result).then(json=>{
                res.status(200).json({success:true,data:json})
               })
            }

            }
            else{
                res.status(200).json({success:false,error:'No Data Found'})
            }
        }catch(err){
            console.log(err)
            res.status(500).json({success:false, error: 'Internal Server Error'})
        }

    }
  }