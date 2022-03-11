var express = require('express');
var router = express.Router();
var pool =  require('../pool');
var upload = require('../multer');
var table = 'finance'


router.get('/',(req,res)=>{
    if(req.session.adminid){
        var query = `select count(id) as today_merchant from vendor where date = curdate();`
        var query1 = `select sum(price) as today_revenue from vendor where date= curdate();`
        var query2 = `select count(id) as total_merchant from vendor;`
        var query3 = `select sum(price) as total_revenue from vendor;`
      
        pool.query(query+query1+query2+query3,(err,result)=>{
            // res.render('Admin/Dashboard',{msg : '',result})
            if(err) throw err;
else res.render('Finance/Dashboard',{msg : '',result})
        })
  }
    else{
        res.render('Finance/login',{msg : '* Invalid Credentials'})

    }
})


router.get('/merchant/:type',(req,res)=>{
    pool.query(`select v.agentid , v.type , v.pincode , v.state , v.city , v.price , v.transaction_id , v.transaction_image, v.userid, v.date,v.payment_status, v.id,
    (select a.channel_partner_id from agent a where a.userid = v.agentid) as merchant_code
    from vendor v where payment_status = '${req.params.type}'`,(err,result)=>{
        if(err) throw err;
        else res.render('Finance/MechantList',{result})
    })
})


router.get('/merchant/status/update',(req,res)=>{
    // console.log(req.query)
    pool.query(`update vendor set payment_status = '${req.query.payment_status}' where id = '${req.query.id}'`,(err,result)=>{
        if(err) throw err;
        else{
          if(req.query.payment_status == 'completed' || req.query.payment_status == 'reject'){
            res.redirect('/finance/dashboard/merchant/pending');
        } 
        else {
          res.redirect('/finance/dashboard/merchant/pending')
        }
              
          }  
    })
})




module.exports = router;