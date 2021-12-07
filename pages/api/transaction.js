import content from './data/sarb.json'
import axios from 'axios'

export default async function handler(req, res) {
    if(req.method === 'POST' && req.url === '/api/transaction'){
            try{
            let response = await axios.post('https://mgr.oneswitch.org/svsmgr/manager/sarb/recon',req.body.data,{
                headers:{
                    'SESSID': req.body.session_id,
                    'Content-Type': 'application/json'
                },
                
            })
            var result = response.data
            if(result){
                if(result.csv && result.csv.length>1){
                let data=formatCSV2JSON(result.csv)
                result.detailedReport = data.formattedData
                result.operations = data.operations
                result.status = data.status
                }
                res.status(200).json({success:true,data:result})

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

  function formatCSV2JSON(data){

      var formattedData=[]
      var operations = []
      var status=[]
    var headers = data[0].split(',')
    data.shift()
    data.forEach(x=>{
           
        var currentData={}
            x.split(',').forEach((d,i)=>{
                if(headers[i] === 'Operation'){
                if(!operations.includes(d)){
                    operations.push(d)
                }
            }
            if(headers[i] === 'Status'){
                if(!status.includes(d)){
                    status.push(d)
                }
            }
            currentData[headers[i]] = d;
                
        })
        formattedData.push(currentData)
        })
        return {formattedData,operations,status}
  }