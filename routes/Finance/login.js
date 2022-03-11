var express = require('express');
var router = express.Router();
var pool =  require('../pool');


var table = 'finance'


router.get('/',(req,res)=>{
  res.render('Finance/login',{msg : ''})

})



router.post('/verification',(req,res)=>{
    let body = req.body
   console.log(req.body)

pool.query(`select * from ${table} where email = '${req.body.email}' and password = '${req.body.password}'`,(err,result)=>{
  if(err) throw err;
  else if(result[0]) {
      req.session.financeid = result[0].id
   res.redirect('/finance/dashboard')
  }
  else {
    res.render('Finance/login',{msg : '* Invalid Credentials'})
  }
})
   })



   router.get('/logout',(req,res)=>{
     req.session.financeid = null;
     res.redirect('/finance')
   })


module.exports = router;
