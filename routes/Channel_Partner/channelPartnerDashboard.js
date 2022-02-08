var express = require('express');
var router = express.Router();
var pool =  require('../pool');
var upload = require('../multer');


router.get('/',(req,res)=>{
    // res.json({msg:req.session})
    if(req.session.channel_partner_id){
        pool.query(`select * from agent where channel_partner_id = '${req.session.channel_partner_id}'`,(err,result)=>{
            if(err) throw err;
            else res.render('Channel_Partner/Dashboard',{result,title:'Channel Partner Dashboard'});
        })
    }
    else{
        res.render('Channel_Partner/login',{msg : '* Invalid Credentials'})

    }
    
    
})



router.get('/agent/details/:id',(req,res)=>{
    if(req.session.channel_partner_id){
        pool.query(`select * from vendor where agentid = '${req.params.id}'`,(err,result)=>{
            if(err) throw err;
            else res.render('Channel_Partner/vendorlist',{result,title:'Channel PArtner Dashboard'});
        })
    }
    else{
        res.render('Channel_Partner/login',{msg : '* Invalid Credentials'})

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
        else res.render('Channel_Partner/vendor-details',{result,vendorid:req.params.id})
    })
})


router.get('/view/all/order/:id',(req,res)=>{
    pool.query(`select b.* , 
    (select p.name from products p where p.id = b.booking_id) as bookingname,
    (select p.image from products p where p.id = b.booking_id) as bookingimage 

    from booking b where b.vendorid = '${req.params.id}'  order by id desc`,(err,result)=>{
        err ? console.log(err) : res.render('Channel_Partner/ORder',{result, title:'Vendor Orders'})
    })
   })


   router.get('/view/all/payout/:id',(req,res)=>{
    pool.query(`select b.*,
    (select p.name from products p where p.id = b.booking_id) as productname
    from booking b where b.payout is not null and b.vendorid = '${req.params.id}' order by date desc;`,(err,result)=>{
        if(err) throw err;
        else res.render('Channel_Partner/single-payout-history',{result})
    })
})


router.get('/logout',(req,res)=>{
    req.session.channel_partner_id = null;
    req.session.channel_partner = null;
    res.redirect('/channel-partner-login')
})







router.get('/add-agent',(req,res)=>{
    if(req.session.channel_partner_id){
    res.render('Channel_Partner/add-agent')
    }
    else {
        res.render('Channel_Partner/login',{msg : '* Invalid Credentials'})

    }
})


router.post('/add-agent/insert',upload.fields([{ name: 'image', maxCount: 1 }, { name: 'icon', maxCount: 8 }]),(req,res)=>{
    let body = req.body
 
    console.log(req.files)
    var otp = Math.floor(1000 + Math.random() * 9000);
    body['userid'] = 'DLSJ' + otp;
    body['channel_partner_id'] = req.session.channel_partner_id;

if(req.files.icon){
    body['image'] = req.files.image[0].filename;
    body['icon'] = req.files.icon[0].filename;
 console.log(req.body)
   pool.query(`insert into agent set ?`,body,(err,result)=>{
       err ? console.log(err) : res.json({msg : 'success'})
   })
}
else {
    body['image'] = req.files.image[0].filename;
    // body['icon'] = req.files.icon[0].filename;
 console.log(req.body)
   pool.query(`insert into agent set ?`,body,(err,result)=>{
       err ? console.log(err) : res.json({msg : 'success'})
   })
}


    
   
})








router.post('/add-agent/update', (req, res) => {
    let body = req.body
    pool.query(`update agent set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) {
            res.json({
                status:500,
                type : 'error',
                description:err
            })
        }
        else {
            res.json({
                status:200,
                type : 'success',
                description:'successfully update'
            })

            
        }
    })
})





router.post('/add-agent/update-image',upload.fields([{ name: 'image', maxCount: 1 }, { name: 'icon', maxCount: 8 }]), (req, res) => {
    let body = req.body;
    body['image'] = req.files.image[0].filename;
    body['icon'] = req.files.icon[0].filename;

    // pool.query(`select image from ${table} where id = '${req.body.id}'`,(err,result)=>{
    //     if(err) throw err;
    //     else {
    //         fs.unlinkSync(`public/images/${result[0].image}`); 


 pool.query(`update agent set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) {
            res.json({
                status:500,
                type : 'error',
                description:err
            })
        }
        else {
            // res.json({
            //     status:200,
            //     type : 'success',
            //     description:'successfully update'
            // })

            res.redirect(`/channel-partner-dashboard/add-agent`)
        }
    })


})




router.get('/add-agent/delete', (req, res) => {
    let body = req.body
    pool.query(`delete from agent where id = ${req.query.id}`, (err, result) => {
        if(err) {
            res.json({
                status:500,
                type : 'error',
                description:err
            })
        }
        else {
            res.json({
                status:200,
                type : 'success',
                description:'successfully delete'
            })
        }
    })
})


module.exports = router;