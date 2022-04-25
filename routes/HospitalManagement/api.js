var express = require('express');
var router = express.Router();
var pool =  require('../pool');
var upload = require('../multer');
let table = 'hospital_management'






router.get('/get-staff',(req,res)=>{
    pool.query(`select * from hospital_staff where vendorid = '${req.query.vendorid}'`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
})






module.exports = router;
