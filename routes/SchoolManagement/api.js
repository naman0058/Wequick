   
var express = require('express');
var router = express.Router();
var upload = require('../multer');
var pool = require('../pool')


  router.get('/get-top-banner',(req,res)=>{
    pool.query(`select * from brands`,(err,result)=>{
      if(err) throw err;
      else res.json(result)
    })
  })



  // Api Start

  router.post('/login',(req,res)=>{
    let body = req.body;
    pool.query(`select * from user where email = '${req.body.email}' and password = '${req.body.password}'` ,(err,result)=>{
      if(err) throw err;
      else if(result[0]) {
        res.json({
          msg : 'success',
          result:result
        })
      }
      else {
        res.json({
          msg : 'user not found'
        })
      }
    })
  })




  router.get('/all-school',(req,res)=>{
    pool.query(`select * from school  order by name`,(err,result)=>{
      if(err) throw err;
      else res.json(result);
    })
  })



  router.get('/profile',(req,res)=>{
    pool.query(`select u.* ,
     (select c.name from class c where c.id = u.class_id ) as classname,
     (select c.name from class c where c.id = u.teacher_class_id ) as teacherclassname
    
    from user u where id = '${req.query.userid}'`,(err,result)=>{
      if(err) throw err;
      else res.json(result)
    })
  })




  
  router.post('/postInsert',upload.single('image'),(req,res)=>{
  let body = req.body
  var today = new Date();
  var dd = today.getDate();
  
  var mm = today.getMonth()+1; 
  var yyyy = today.getFullYear();
  if(dd<10) 
  {
      dd='0'+dd;
  } 
  
  if(mm<10) 
  {
      mm='0'+mm;
  } 
  today = yyyy+'-'+mm+'-'+dd;

  body['image'] = req.file.filename;
  body['date'] = today
 
console.log(req.body)

      pool.query(`insert into post set ?`,body,(err,result)=>{
          err ? console.log(err) : res.json({msg : 'success'})
      })
    })





     router.post('/getAllPost',(req,res)=>{
  pool.query(`select t.* , 
  (select s.name from school s where s.id =  '${req.body.school_id}') as schoolname,
  (select l.id from like_post l where l.postid = t.id and l.userid = '${req.body.userid}') as isUserLike
  from post t where t.school_id = '${req.body.school_id}' order by id desc;`,(err,result)=>{
     err ? console.log(err) : res.json(result)
 })
     })




// router.get('/myTalent',(req,res)=>{
//   pool.query(`select * from talent  where number='${req.body.number}'  order by id desc;`,(err,result)=>{
//      err ? console.log(err) : res.json(result)
//  })
// })





router.post('/like',(req,res)=>{
 

      let body = req.body


  pool.query(`select * from like_post where postid = '${req.body.postid}' and userid = '${req.body.userid}'`,(err,result)=>{
      if(err) throw err;
      else if(result[0]){
  pool.query(`delete from like_post where postid = '${req.body.postid}' and userid = '${req.body.userid}'`,(err,result)=>{
      if(err) throw err;
      else {
          pool.query(`update post set likes = likes-1 where id = '${req.body.postid}'`,(err,result)=>{
              if(err) throw err;
              else  res.json({msg:'success'})
          })
        }
  })
      }
      else{
  pool.query(`insert into like_post set ?`,body,(err,result)=>{
      if(err) throw err;
      else {
  pool.query(`update post set likes = likes+1 where id = '${req.body.postid}'`,(err,result)=>{
      if(err) throw err;
      else  res.json({msg:'success'})
  })

           }
  })
      }
  })
})





router.post('/comment',(req,res)=>{
  let body = req.body
 pool.query(`insert into comment set ?`,body,(err,result)=>{
     err ? console.log(err) : res.json({msg : 'success'})
 })

})




router.post('/get-comment',(req,res)=>{
  pool.query(`select c.*, 
  (select u.name from user u where u.id = c.userid) as username,
  (select u.image from user u where u.id = c.userid) as userimage
   from comment c where c.postid = '${req.body.postid}'`,(err,result)=>{
      if(err) throw err;
      else res.json(result)
  })
})





router.post('/get-home-work',(req,res)=>{
  pool.query(`select * from home_work where school_id = '${req.body.school_id}' and class_id = '${req.body.class_id}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})


router.post('/get-home-work',(req,res)=>{
  pool.query(`select * from home_work where school_id = '${req.body.school_id}' and class_id = '${req.body.class_id}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})




router.post('/get-attendance',(req,res)=>{
  var query = `select count(id) as present_counter from attendance where userid = '${req.body.userid}' and MONTH(date)=MONTH(now())
  and YEAR(date)=YEAR(now()) and attendance = 'present';`
  var query1 = `select count(id) as absent_counter from attendance where userid = '${req.body.userid}' and MONTH(date)=MONTH(now())
  and YEAR(date)=YEAR(now()) and attendance = 'absent';`
  var query2 = `select count(id) as holiday_counter from attendance where userid = '${req.body.userid}' and MONTH(date)=MONTH(now())
  and YEAR(date)=YEAR(now()) and attendance = 'holiday';`
  var query3 = `select count(id) as leave_counter  from attendance where userid = '${req.body.userid}' and MONTH(date)=MONTH(now())
  and YEAR(date)=YEAR(now()) and attendance = 'leave';`
  pool.query(query+query1+query2+query3,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})



router.post('/leave-request',upload.single('logo'),(req,res)=>{
  let body = req.body
  var today = new Date();
  var dd = today.getDate();
  
  var mm = today.getMonth()+1; 
  var yyyy = today.getFullYear();
  if(dd<10) 
  {
      dd='0'+dd;
  } 
  
  if(mm<10) 
  {
      mm='0'+mm;
  } 
  today = yyyy+'-'+mm+'-'+dd;

  body['date'] = today;

  if(req.file){
  body['logo'] = req.file.filename;
  }
  console.log(req.body)
  pool.query(`insert into leave_request set ?`,body,(err,result)=>{
    if(err) throw err;
    else res.json({
      status:200
    })
  })
})



router.get('/my-leave',(req,res)=>{
  pool.query(`select * from leave_request where userid = '${req.query.userid}' order by id desc`,(err,result)=>{
    if(err) throw err;
    else res.json(result);
  })
})




router.post('/get-time-table',(req,res)=>{
  pool.query(`select t.*, 
  (select s.name from subject s where s.id = t.period1) as subjectname1,
  (select s.name from subject s where s.id = t.period2) as subjectname2,
  (select s.name from subject s where s.id = t.period3) as subjectname3,
  (select s.name from subject s where s.id = t.period4) as subjectname4,
  (select s.name from subject s where s.id = t.period5) as subjectname5,
  (select s.name from subject s where s.id = t.period6) as subjectname5,
  (select s.name from subject s where s.id = t.period7) as subjectname7
  from time_table t where t.school_id = '${req.body.school_id}' and t.class_id = '${req.body.class_id}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})




router.post('/get-holidays',(req,res)=>{
  var query = `select * from holidays where MONTH(date)=MONTH(now())
  and YEAR(date)=YEAR(now()) and school_id = '${req.body.school_id}';`
  var query1 = `select * from holidays where  YEAR(date)=YEAR(now()) and school_id = '${req.body.school_id}';`
 
  pool.query(query+query1,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})




router.post('/get-syllabus',(req,res)=>{
  pool.query(`select * from syllabus where school_id = '${req.body.school_id}' and class_id = '${req.body.class_id}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})



router.post('/get-result',(req,res)=>{

  pool.query(`select * from result where school_id = '${req.body.school_id}' and userid = '${req.body.userid}' and class_id = '${req.body.class_id}' and type= '${req.body.type}' `,(err,result)=>{

    if(err) throw err;
    else res.json(result)
  })
})




// teacher api starts



router.get('/your-class-student-list',(req,res)=>{


  var today = new Date();
  var dd = today.getDate();
  
  var mm = today.getMonth()+1; 
  var yyyy = today.getFullYear();
  if(dd<10) 
  {
      dd='0'+dd;
  } 
  
  if(mm<10) 
  {
      mm='0'+mm;
  } 
  today = yyyy+'-'+mm+'-'+dd;

  pool.query(`select u.* , (select a.attendance from attendance a where a.userid = u.id and a.date = '${today}') as issttendance from user u where u.class_id = '${req.query.class_id}' and role = 'student'`,(err,result)=>{
    if(err) throw err;
    else res.json(result);
  })  
})


router.post('/update-attendance',(req,res)=>{
  let body = req.body
  var today = new Date();
  var dd = today.getDate();
  
  var mm = today.getMonth()+1; 
  var yyyy = today.getFullYear();
  if(dd<10) 
  {
      dd='0'+dd;
  } 
  
  if(mm<10) 
  {
      mm='0'+mm;
  } 
  today = yyyy+'-'+mm+'-'+dd;

  body['date'] = today
  

  pool.query(`select id from attendance where school_id = '${req.body.school_id}' and userid = '${req.body.userid}' and class_id = '${req.body.class_id}' and date = '${today}'`,(err,result)=>{
    if(err) throw err;
    else if(result[0]){
    let id = result[0].id
    pool.query(`update attendance set ? where id = ?`, [req.body, id], (err, result) => {
        if(err) throw err;
        else res.json({msg:'success'})
    })
    }
    else{
        pool.query(`insert into attendance set ?`,body,(err,result)=>{
            if(err) throw err;
            else res.json({msg:'success'})
        })
    }
})



})




router.get('/single-profile',(req,res)=>{
  pool.query(`select u.* , 
  (select c.name from class c where c.id = u.class_id) as classname
   from user u  where u.id = '${req.query.userid}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result);
  })
})



router.post('/student-result',(req,res)=>{
  pool.query(`select u.* , 
  (select sum(marks_obtain) from result r where r.student_id = u.id and r.school_id = '${req.body.school_id}' and r.class_id = '${req.body.class_id}' and r.type= '${req.body.type}') as usermarks,
  (select sum(total_marks) from result r where r.student_id = u.id and r.school_id = '${req.body.school_id}' and r.class_id = '${req.body.class_id}' and r.type= '${req.body.type}') as totalmarks,
  (select count(id) from result r where r.student_id = u.id and r.school_id = '${req.body.school_id}' and r.class_id = '${req.body.class_id}' and r.type= '${req.body.type}') as counter
  from user u where u.role = 'student'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})




router.post(`/exams`,(req,res)=>{
  pool.query(`select * from exams where school_id = '${req.body.school_id}' and class_id = '${req.body.class_id}' order by name`,(err,result)=>{
    if(err) throw err;
    else res.json(result);
  })
})


router.post('/get-single-result',(req,res)=>{
  console.log(req.body)
  pool.query(`select r.* , (select s.name from subject s where s.id = r.subject_id) as subjectname from result r where r.student_id = '${req.body.student_id}' and r.type = '${req.body.type}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})

// teacher spi ends



router.get('/get-all-class',(req,res)=>{
  pool.query(`select * from class where school_id = '${req.query.school_id}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result);
  })
})


router.get('/subject-by-class',(req,res)=>{
  pool.query(`select * from subject where class_id = '${req.query.class_id}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result);
  })
})



router.post('/syllabus-planning',upload.single('logo'),(req,res)=>{
  let body = req.body
  var today = new Date();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

  var dd = today.getDate();
  
  var mm = today.getMonth()+1; 
  var yyyy = today.getFullYear();
  if(dd<10) 
  {
      dd='0'+dd;
  } 
  
  if(mm<10) 
  {
      mm='0'+mm;
  } 
  today = yyyy+'-'+mm+'-'+dd;

  body['date'] = today;
  body['time'] = time;
  if(req.file){
  body['logo'] = req.file.filename;
  }
  console.log(req.body)
  pool.query(`insert into syallbus_planning set ?`,body,(err,result)=>{
    if(err) throw err;
    else res.json({
      status:200
    })
  })
})




router.get('/get-syllabus-planning',(req,res)=>{
  pool.query(`select h.*, 
  (select c.name from class c where c.id = h.class_id) as classname,
  (select s.name from subject s where s.id = h.subjectid) as subjectname
  from syallbus_planning h where h.userid = '${req.query.userid}' and h.type = '${req.query.type}' order by id desc`,(err,result)=>{
    if(err) throw err;
    else res.json(result);
  })
})



router.get('/get-all-teachers',(req,res)=>{
  pool.query(`select id , name from user where role = 'teacher' and school_id = '${req.query.school_id}' and class_id = '${req.query.class_id}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})


router.get('/get-all-student',(req,res)=>{
  pool.query(`select id , name from user where role = 'student' and school_id = '${req.query.school_id}' and class_id = '${req.query.class_id}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})



router.post('/chat',(req,res)=>{

  let body = req.body
  var today = new Date();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dd = today.getDate();
  
  var mm = today.getMonth()+1; 
  var yyyy = today.getFullYear();
  if(dd<10) 
  {
      dd='0'+dd;
  } 
  
  if(mm<10) 
  {
      mm='0'+mm;
  } 
  today = yyyy+'-'+mm+'-'+dd;

  body['date'] = today;
  body['time'] = time;



  pool.query(`insert into chat set ?`,body,(err,result)=>{
    if(err) throw err;
    else res.json({msg:'success'});
  });
});



router.get('/all-messages-from-student',(req,res)=>{
  pool.query(`select c.*,
  (select u.image from user u where u.id = '${req.query.student_id}') as studentimage,
  (select u.image from user u where u.id = '${req.query.userid}') as teacherimage,
  (select u.number from user u where u.id = '${req.query.student_id}') as studentnumber
  
  from chat c where c.student_id = '${req.query.student_id}' and c.teacher_id = '${req.query.userid}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})



router.get('/all-messages-from-teacher',(req,res)=>{
  pool.query(`select c.* ,
  (select u.image from user u where u.id = '${req.query.teacher_id}') as teacherimage,
  (select u.image from user u where u.id = '${req.query.userid}') as studentimage,
  (select u.number from user u where u.id = '${req.query.teacher_id}') as teachernumber
  from chat c where c.teacher_id = '${req.query.teacher_id}' and c.student_id = '${req.query.userid}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})








router.post('/homework-insert',upload.single('logo'),(req,res)=>{
  let body = req.body
  var today = new Date();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

  var dd = today.getDate();
  
  var mm = today.getMonth()+1; 
  var yyyy = today.getFullYear();
  if(dd<10) 
  {
      dd='0'+dd;
  } 
  
  if(mm<10) 
  {
      mm='0'+mm;
  } 
  today = yyyy+'-'+mm+'-'+dd;

  body['date'] = today;
  body['time'] = time;

  if(req.file){
  body['logo'] = req.file.filename;
  }
  console.log(req.body)
  pool.query(`insert into home_work set ?`,body,(err,result)=>{
    if(err) throw err;
    else {
      pool.query(`insert into notifications(type,school_id , class_id , subjectid,userid) values('student','${req.body.school_id}' , '${req.body.class_id}' , '${req.body.subjectid}' , '${req.body.userid}')`,(err,result)=>{
        if(err) throw err;
        else res.json({
          status:200
        })
      })
    }

  })
})




router.get('/get-homework',(req,res)=>{
  pool.query(`select h.* , 
  (select c.name from class c where c.id = h.class_id) as classname,
  (select s.name from subject s where s.id = h.subjectid) as subjectname
  
  from home_work h where h.userid = '${req.query.userid}' order by id desc limit 18`,(err,result)=>{
    if(err) throw err;
    else res.json(result);
  })
})



router.post('/home-work-update',upload.single('logo'), (req, res) => {
  console.log(req.body)

  if(req.file){
	body['logo'] = req.file.filename;
  }

  pool.query(`update home_work set ? where id = ?`, [req.body, req.body.id], (err, result) => {
      if(err) throw err;
      else res.json(result);
  })
})



router.post('/home-work-update',upload.single('logo'), (req, res) => {
  console.log(req.body)

  if(req.file){
	body['logo'] = req.file.filename;
  }

  pool.query(`update home_work set ? where id = ?`, [req.body, req.body.id], (err, result) => {
      if(err) throw err;
      else res.json(result);
  })
})


router.get('/get-notification',(req,res)=>{
    pool.query(`select n.* , (select s.name from subject s where s.id = n.subjectid ) as subjectname from notifications n where school_id = '${req.body.school_id}' and class_id = '${req.body.class_id}' and type = 'student' order by id desc limit 6`,(err,result)=>{
      if(err) throw err;
      else res.json(result)
    })
})
















router.post('/insert-data',(req,res)=>{
  let body = req.body
  console.log(req.body)
  pool.query(`insert into dummy set ?`,body,(err,result)=>{
    if(err) {
      res.json({
        status:500,
        type : 'error',
        description:err
    })
    }
    else res.json({status:200,description:'success'})
  })
})


router.get('/get-data',(req,res)=>{
  pool.query(`select * from dummy order by id desc`,(err,result)=>{
    if(err) {
      res.json({
        status:500,
        type : 'error',
        description:err
    })
    }
    else res.json(result)
  })
})


router.post('/update-data', (req, res) => {
  console.log(req.body)
  pool.query(`update dummy set ? where id = ?`, [req.body, req.body.id], (err, result) => {
      if(err) {
          res.json({
              status:500,
              type : 'error',
              description:err
          })
      }
      else {
  res.json({status:200,description:'success'})
      }
  })
})


router.get('/delete-data',(req,res)=>{
  pool.query(`delete from dummy where id = '${req.query.id}'`,(err,result)=>{
    if(err) throw err;
    else {
      res.json({status:200,description:'success'})

    }
  })
})



module.exports = router;
