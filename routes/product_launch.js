var express = require('express');
var router = express.Router();
var pool =  require('./pool');
var upload = require('./multer');
const fetch = require("node-fetch");
var table = 'product_launch'

// new secion start


router.post('/add-product_launch',upload.single('image'),(req,res)=>{
    let body = req.body;
    body['image'] = req.file.filename
    
var today = new Date();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = yyyy + '-' + mm + '-' + dd;


  body['date'] = today;
  body['time'] = time;
   pool.query(`insert into ${table} set ?`,body,(err,result)=>{
     if(err) throw err;
     else res.json(result);
   })
  })
  
  router.get('/get-product_launch',(req,res)=>{
    pool.query(`select * from ${table} where vendorid = '${req.query.vendorid}' order by id desc`,(err,result)=>{
      if(err) throw err;
      else res.json(result)
    })
  })
  
  router.get('/delete-product_launch',(req,res)=>{
    pool.query(`delete from ${table} where id = '${req.query.id}'`,(err,result)=>{
      if(err) throw err;
      else res.json(result);
    })
  })
  
  
  router.get('/single-product_launch',(req,res)=>{
    pool.query(`select * from ${table} where id = '${req.query.id}'`,(err,result)=>{
      if(err) throw err;
      else res.json(result);
    })
  })
  
  
  

  
  router.get('/all-product_launch',(req,res)=>{
    pool.query(`select * from ${table} where status = 'approved' order by id desc`,(err,result)=>{
      if(err) throw err;
      else res.json(result)
    })
  })
  
  
  
  
  router.get('/list/:type',(req,res)=>{
    pool.query(`select v.* , (select c.name from category c where c.id = v.categoryid) as categoryname from news v where v.status = '${req.params.type}' order by id desc`,(err,result)=>{
        err ? console.log(err) : res.render('Admin/New-Product-Launch',{result})
    })
})
  
  

router.get('/update-status',(req,res)=>{
  let body = req.body;
 pool.query(`update ${table} set status = '${req.query.status}' where id = ${req.query.id}`,(err,result)=>{
   if(err) throw err;
   else res.redirect('/product-launch/list/pending')
 })
})
  
  
  // news section end

module.exports = router;