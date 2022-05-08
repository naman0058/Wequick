var express = require('express');
var router = express.Router();
var pool =  require('./pool');
var upload = require('./multer');
const fetch = require("node-fetch");
var table = 'news'

// new secion start


router.post('/add-news',upload.single('image'),(req,res)=>{
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
  body['status'] = 'pending'
   pool.query(`insert into ${table} set ?`,body,(err,result)=>{
     if(err) throw err;
     else res.json({msg:'success'})
   })
  })
  
  router.get('/get-news',(req,res)=>{
    pool.query(`select * from ${table} where categoryid = '${req.query.categoryid}' order by id desc`,(err,result)=>{
      if(err) throw err;
      else res.json(result)
    })
  })
  
  router.get('/delete-news',(req,res)=>{
    pool.query(`delete from ${table} where id = '${req.query.id}'`,(err,result)=>{
      if(err) throw err;
      else res.json(result);
    })
  })
  
  
  router.get('/single-news',(req,res)=>{
    pool.query(`select * from ${table} where id = '${req.query.id}'`,(err,result)=>{
      if(err) throw err;
      else res.json(result);
    })
  })
  
  
  
  router.post('/update-news-image',upload.single('image'),(req,res)=>{
    let body = req.body;
    body['image'] = req.file.filename
   pool.query(`update ${table} set ? where id = ?`,[body, req.body.id],(err,result)=>{
     if(err) throw err;
     else res.json(result);
   })
  })
  
  
  router.post('/update-news',(req,res)=>{
    let body = req.body;
    console.log('body',body)
   pool.query(`update ${table} set ? where id = ?`,[body, req.body.id],(err,result)=>{
     if(err) throw err;
     else res.json(result);
   })
  })
  
  
  router.get('/all-news',(req,res)=>{
    pool.query(`select * from blogs where type = 'news_portal' order by id desc`,(err,result)=>{
      if(err) throw err;
      else res.json(result)
    })
  })


  router.get('/single-all-news',(req,res)=>{
    pool.query(`select * from blogs where id = '${req.query.id}' order by id desc`,(err,result)=>{
      if(err) throw err;
      else res.json(result)
    })
  })
  


  router.get('/list/:type',(req,res)=>{
    pool.query(`select v.* , (select c.name from category c where c.id = v.categoryid) as categoryname from news v where v.status = '${req.params.type}' order by id desc`,(err,result)=>{
        err ? console.log(err) : res.render('Admin/New-list',{result})
    })
})
  
  

router.get('/update-status',(req,res)=>{
  let body = req.body;
 pool.query(`update ${table} set status = '${req.query.status}' where id = ${req.query.id}`,(err,result)=>{
   if(err) throw err;
   else res.redirect('/news/list/pending')
 })
})
  
  // news section end

module.exports = router;