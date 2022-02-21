var express = require('express');
var router = express.Router();
var pool =  require('../pool');
var upload = require('../multer');


router.post('/validate',(req,res)=>{
    console.log(req.body)
    pool.query(`select * from channel_partner where number = '${req.body.number}'`,(err,result)=>{
        if(err) throw err;
        else if(result[0]){
            console.log(result)
            res.json({msg:'success',result})
        }
        else {
            res.json({msg:'invalid'})
        }
    })
})



router.post('/get-all-agent',(req,res)=>{
    pool.query(`select * from agent where channel_partner_id = '${req.body.id}'`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
})




router.post('/get-all-merchant',(req,res)=>{
    pool.query(`select * from vendor where agentid = '${req.body.id}'`,(err,result)=>{
            if(err) throw err;
            else res.json(result)
        })
})



router.post('/single-merchant',(req,res)=>{
    var query = `select v.* , (select c.name from category c where c.id = v.categoryid) as categoryname from vendor v where v.id = '${req.body.id}';`
    var query1 = `select sum(price) as total_price from booking where vendorid = '${req.body.id}';`
    var query2 = `select count(id) as total_orders from booking where vendorid = '${req.body.id}';`
    var query3 = `select count(id) as running_orders from booking where status != 'delivered' and vendorid = '${req.body.id}';`
    var query4 = `select count(id) as completed_orders from booking where status = 'delivered' and vendorid = '${req.body.id}';`
    var query5 = `select b.* , (select p.name from products p where p.id = b.booking_id) as productname from booking b where vendorid = '${req.body.id}' order by id desc limit 10;`

    pool.query(query+query1+query2+query3+query4+query5,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
})





router.post('/all-order',(req,res)=>{
    pool.query(`select b.* , 
    (select p.name from products p where p.id = b.booking_id) as bookingname,
    (select p.image from products p where p.id = b.booking_id) as bookingimage 
    from booking b where b.vendorid = '${req.body.id}'  order by id desc`,(err,result)=>{
        err ? console.log(err) : res.json(result)
    })
   })


   router.get('/all-payout',(req,res)=>{
    pool.query(`select b.*,
    (select p.name from products p where p.id = b.booking_id) as productname
    from booking b where b.payout is not null and b.vendorid = '${req.body.id}' order by date desc;`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
})




router.post('/add-agent',upload.fields([{ name: 'image', maxCount: 1 }, { name: 'icon', maxCount: 8 }]),(req,res)=>{
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








router.post('/update-agent', (req, res) => {
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





router.post('/update-agent-image',upload.fields([{ name: 'image', maxCount: 1 }, { name: 'icon', maxCount: 8 }]), (req, res) => {
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




router.get('/delete-agent', (req, res) => {
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