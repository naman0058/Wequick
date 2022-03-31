var express = require('express');
const pool = require('../routes/pool');
var router = express.Router();
var table = 'Khatabook'



router.post('/add-customer',(req,res)=>{
    let body = req.body;
    body['amount'] = 0;
    body['color'] = 'green';

    pool.query(`insert into khatabook_customer set ?`,body,(err,result)=>{
        if(err) throw err;
        else res.json({
            msg : 'success'
        })
    })
})



router.get('/get-customer',(req,res)=>{
    pool.query(`select * from khatabook_customer where vendorid = '${req.query.vendorid}'`,(err,result)=>{
        if(err) throw err;
        else req.json(result)
    })
})





router.post('/add-transaction',(req,res)=>{

    pool.query(`select amount from khatabook_customer where id = '${req.body.customer_id}'`,(err,result)=>{
        if(err) throw err;
        else {
            let oldamount = result[0].amount;
    let newamount = 0
    let newcolor = 0

            if(req.body.color == 'red'){
                newamount = (+oldamount) - req.body.amount
                
   }
                    else{
                        newamount = (+oldamount) + (+req.body.amount)

                    }


                    if(newamount>0){
                        newcolor = 'green'
                    }
                    else{
                        newcolor = 'red'
                    }

                    pool.query(`update khatabook_customer set amount = ${newamount} , color = '${newcolor}' where id = '${req.body.customer_id}'`,(err,result)=>{
                        if(err) throw err;
                        else {

                            let body = req.body;
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    
    
    today = yyyy + '-' + mm + '-' + dd;
    
    
      body['date'] = today;
      body['time'] = time;

    pool.query(`insert into khatabook_transaction set ?`,body,(err,result)=>{
        if(err) throw err;
        else res.json({
            msg : 'success'
        })
    })

                        }
                    })

                    // res.json({newamount,newcolor})


        }
    })


    
})



router.get('/get-transaction',(req,res)=>{
    pool.query(`select * from khatabook_transaction where customer_id = '${req.query.customer_id}'`,(err,result)=>{
        if(err) throw err;
        else req.json(result)
    })
})



router.get('/date-wise-filter',(req,res)=>{
    pool.query(`select * from khatabook_transaction where vendorid = '${req.query.vendorid}' and date between '${req.query.from_date}' and '${req.query.to_date}'`)
})

module.exports = router;