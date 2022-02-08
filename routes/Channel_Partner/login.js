var express = require('express');
var router = express.Router();
var pool =  require('../pool');


const SendOtp = require('sendotp');
const sendOtp = new SendOtp(`300563AFuzfOZn9ESb5db12f8f`);





router.get('/',(req,res)=>{
  res.render('Channel_Partner/login',{msg : ''})

})





router.post('/verification',(req,res)=>{
    let body = req.body
    body['number'] = req.body.number
      console.log(req.body)

pool.query(`select * from channel_partner where number = '${req.body.number}'`,(err,result)=>{
  if(err) throw err;
  else if(result[0]) {
    req.session.unverifychannelpartnernumber = req.body.number
    var otp =   Math.floor(100000 + Math.random() * 9000);
    req.session.reqotp = otp;
    res.render('Channel_Partner/otp1',{msg : otp , anothermsg:''})

//     sendOtp.send(req.body.number, "DELOTM", otp,(err,result)=>{
//         if(err) throw err;
//         else{
//           res.render('Vendor/login',{msg : 'Number Not Exists' })
//    }
//        })

    
    

  }
  else {
    res.render('Channel_Partner/login',{msg : '* Mobile Number Not Exists'})
  }
})


   
     
    
   })




router.post('/add-user',(req,res)=>{
  req.session.numberverify = 91+req.body.number
  req.session.name = req.body.name
  var otp =   Math.floor(100000 + Math.random() * 9000);
  req.session.reqotp = otp;
 

  sendOtp.send(req.body.number, "DELOTM", otp,(err,result)=>{
    if(err) throw err;
    else{
      res.render('otp1',{msg : '' , anothermsg:''})
}
   })
 
  res.render('otp1',{msg : '' , anothermsg:''})

})



router.post('/new-user',(req,res)=>{
  let body = req.body;
  if(req.body.otp == req.session.reqotp){
   req.session.channel_partner = req.session.unverifychannelpartnernumber;
   pool.query(`select userid from channel_partner where number = '${req.session.channel_partner}'`,(err,result)=>{
     if(err) throw err;
     else {
       req.session.channel_partner_id = result[0].userid;
    //    req.session.cityid = result[0].categoryid;
   res.redirect('/channel-partner-dashboard')

     }
   })

  }
  else{

  res.render('Channel_Partner/otp1',{msg : req.session.reqotp , anothermsg : 'Invalid Otp'})
    
  }
})


module.exports = router;
