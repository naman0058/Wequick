var express = require('express');
var router = express.Router();
var pool =  require('../pool');
var upload = require('../multer');



router.post('/validate',(req,res)=>{
    pool.query(`select * from agent where number = '${req.body.number}'`,(err,result)=>{
        if(err) throw err;
        else if(result[0]){
            res.json({msg:'success',result})
        }
        else {
            res.json({msg:'invalid'})
        }
    })
})



module.exports = router;