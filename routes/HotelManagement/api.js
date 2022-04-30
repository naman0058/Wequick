var express = require('express');
var router = express.Router();
var pool =  require('../pool');
var upload = require('../multer');
let table = 'hotel_staff'



router.post('/add-staff',upload.fields([{ name: 'image', maxCount: 1 }, { name: 'aadhar_card_front', maxCount: 8 } , { name: 'aadhar_card_back', maxCount: 8 } , { name: 'pan_card', maxCount: 8 } , { name: 'higher_education_marksheet', maxCount: 8 }]),(req,res)=>{
    let body = req.body
  
    // console.log(req.files)
    
  
  
    body['image'] = req.files.image[0].filename;
    body['aadhar_card_front'] = req.files.aadhar_card_front[0].filename;
    body['aadhar_card_back'] = req.files.aadhar_card_back[0].filename;
    body['pan_card'] = req.files.pan_card[0].filename;
    body['higher_education_marksheet'] = req.files.higher_education_marksheet[0].filename;
  
  
  
  
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    
    today = yyyy + '-' + mm + '-' + dd;
    
    
      body['date'] = today;
      body['time'] = time;
  
  console.log(req.body)
     pool.query(`insert into hotel_staff set ?`,body,(err,result)=>{
      if(err) res.json(err);
      else res.json({msg:'success'})
     })
  })
    


router.get('/get-staff',(req,res)=>{
    pool.query(`select * from hotel_staff where vendorid = '${req.query.vendorid}'`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
})



router.get('/single-staff-details',(req,res)=>{
    pool.query(`select * from hotel_staff where id = '${req.query.id}'`,(err,result)=>{
        if(err) throw err;
        else res.json(result);
    })
})


router.get('/delete-staff-details',(req,res)=>{
    pool.query(`delete from hotel_staff where id = '${req.query.id}'`,(err,result)=>{
        if(err) throw err;
        else res.json({msg:'success'});
    })
})




router.post('/room-category-add',(req,res)=>{
    let body = req.body
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
      body['date'] = today;
      body['time'] = time;
     pool.query(`insert into hotel_room_category set ?`,body,(err,result)=>{
      if(err) res.json(err);
      else res.json({msg:'success'})
     })
  })



  router.get('/get-room-category',(req,res)=>{
    pool.query(`select * from hotel_room_category where vendorid = '${req.query.vendorid}'`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
})
    


router.get('/delete-room-category',(req,res)=>{
    pool.query(`delete from hotel_room_category where id = '${req.query.id}'`,(err,result)=>{
        if(err) throw err;
        else res.json({msg:'success'});

    })
})




router.post('/room-management-add',(req,res)=>{
    let body = req.body
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
      body['date'] = today;
      body['time'] = time;
     pool.query(`insert into hotel_room_management set ?`,body,(err,result)=>{
      if(err) res.json(err);
      else res.json({msg:'success'})
     })
  })



  router.get('/get-room-management',(req,res)=>{
    pool.query(`select * from hotel_room_management where vendorid = '${req.query.vendorid}'`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
})
    


router.get('/delete-room-management',(req,res)=>{
    pool.query(`delete from hotel_room_management where id = '${req.query.id}'`,(err,result)=>{
        if(err) throw err;
        else res.json({msg:'success'});

    })
})




router.post('/staff-designation-add',(req,res)=>{
    let body = req.body
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
      body['date'] = today;
      body['time'] = time;
     pool.query(`insert into hotel_staff_designation set ?`,body,(err,result)=>{
      if(err) res.json(err);
      else res.json({msg:'success'})
     })
  })



  router.get('/get-staff-designation',(req,res)=>{
    pool.query(`select * from hotel_staff_designation where vendorid = '${req.query.vendorid}'`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
})
    


router.get('/delete-staff-designation',(req,res)=>{
    pool.query(`delete from hotel_staff_designation where id = '${req.query.id}'`,(err,result)=>{
        if(err) throw err;
        else res.json({msg:'success'});

    })
})





router.post('/add-hotel-user',upload.fields([{ name: 'aadhar_front', maxCount: 8 } , { name: 'aadhar_back', maxCount: 8 }]),(req,res)=>{
    let body = req.body
  console.log(body)


    body['aadhar_front'] = req.files.aadhar_card_front[0].filename;
    body['aadhar_back'] = req.files.aadhar_card_back[0].filename;
 
  
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    
    today = yyyy + '-' + mm + '-' + dd;
    
    
      body['date'] = today;
      body['time'] = time;
  console.log(body)

  
  console.log(req.body)
     pool.query(`insert into hotel_user set ?`,body,(err,result)=>{
      if(err) res.json(err);
      else res.json({msg:'success'})
     })
  })
    





module.exports = router;
