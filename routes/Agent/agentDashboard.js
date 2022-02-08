var express = require('express');
var router = express.Router();
var pool =  require('../pool');
var upload = require('../multer');


router.get('/',(req,res)=>{
    if(req.session.agentid){
        pool.query(`select * from vendor where agentid = '${req.session.agentid}'`,(err,result)=>{
            if(err) throw err;
            else res.render('Agent/Dashboard',{result,title:'Agent Dashboard'});
        })
    }
    else{
        res.render('Agent/login',{msg : '* Invalid Credentials'})

    }
    
    
})




router.get('/vendor/details/:id',(req,res)=>{
    var query = `select v.* , (select c.name from category c where c.id = v.categoryid) as categoryname from vendor v where v.id = '${req.params.id}';`
    var query1 = `select sum(price) as total_price from booking where vendorid = '${req.params.id}';`
    var query2 = `select count(id) as total_orders from booking where vendorid = '${req.params.id}';`
    var query3 = `select count(id) as running_orders from booking where status != 'delivered' and vendorid = '${req.params.id}';`
    var query4 = `select count(id) as completed_orders from booking where status = 'delivered' and vendorid = '${req.params.id}';`
    var query5 = `select b.* , (select p.name from products p where p.id = b.booking_id) as productname from booking b where vendorid = '${req.params.id}' order by id desc limit 10;`

    pool.query(query+query1+query2+query3+query4+query5,(err,result)=>{
        if(err) throw err;
        else res.render('Agent/vendor-details',{result,vendorid:req.params.id})
    })
})


router.get('/view/all/order/:id',(req,res)=>{
    pool.query(`select b.* , 
    (select p.name from products p where p.id = b.booking_id) as bookingname,
    (select p.image from products p where p.id = b.booking_id) as bookingimage 

    from booking b where b.vendorid = '${req.params.id}'  order by id desc`,(err,result)=>{
        err ? console.log(err) : res.render('Agent/ORder',{result, title:'Vendor Orders'})
    })
   })


   router.get('/view/all/payout/:id',(req,res)=>{
    pool.query(`select b.*,
    (select p.name from products p where p.id = b.booking_id) as productname
    from booking b where b.payout is not null and b.vendorid = '${req.params.id}' order by date desc;`,(err,result)=>{
        if(err) throw err;
        else res.render('Agent/single-payout-history',{result})
    })
})


router.get('/logout',(req,res)=>{
    req.session.agentid = null;
    req.session.agentnumber = null;
    res.redirect('/agent-login')
})

module.exports = router;