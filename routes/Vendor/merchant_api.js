var express = require('express');
var router = express.Router();
var pool =  require('../pool');
var upload = require('../multer');



router.get('/add-product',(req,res)=>{
     res.render('Merchant_Webview/product',{vendorid:req.query.vendorid,categoryid:req.query.categoryid});
})



router.post('/insert',upload.fields([{ name: 'image', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]),(req,res)=>{
    let body = req.body
 
    // console.log(req.files)
    if(req.body.discount==0 || req.body.discount == null){
        body['net_amount'] = 0
    }
    else{
        let price = ((req.body.price)*(req.body.discount))/100
        let net_price = (req.body.price)-price
        body['net_amount'] = Math.round(net_price);
        body['categoryid'] = req.session.categoryid;
    }

    body['image'] = req.files.image[0].filename;
    body['thumbnail'] = req.files.thumbnail[0].filename;
 console.log('mydata',req.body)
   pool.query(`insert into products set ?`,body,(err,result)=>{
       err ? console.log(err) : res.json({msg : 'success'})
   })

   
})



router.get('/show-product',(req,res)=>{
    pool.query(`select p.* , 
    (select s.name from subcategory s where s.id = p.subcategoryid) as subcategoryname,
    (select b.name from brand b where b.id = p.brandid) as brandname
     from products p where p.vendorid = '${req.query.vendorid}' order by id desc`,(err,result)=>{
        err ? console.log(err) : res.json(result)
    })
})


router.get('/subcategory',(req,res)=>{
      pool.query(`select * from subcategory where categoryid = '${req.query.categoryid}'`,(err,result)=>{
            err ? console.log(err) : res.json(result)
        })
    })

    
    router.post('/update', (req, res) => {
        let body = req.body
        if(req.body.discount==0 || req.body.discount == null){
            body['net_amount'] = 0
        }
        else{
            let price = ((req.body.price)*(req.body.discount))/100
            let net_price = (req.body.price)-price
            body['net_amount'] = Math.round(net_price);
      
        }
        console.log(req.body)
        pool.query(`update products set ? where id = ?`, [req.body, req.body.id], (err, result) => {
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



    router.post('/update-image/:vendorid/:categoryid',upload.fields([{ name: 'image', maxCount: 1 }, { name: 'thumbnail', maxCount: 8 }]), (req, res) => {
        let body = req.body;
    console.log(req.files)

        body['image'] = req.files.image[0].filename;
        body['thumbnail'] = req.files.thumbnail[0].filename;
    console.log(req.body)
        // pool.query(`select image from ${table} where id = '${req.body.id}'`,(err,result)=>{
        //     if(err) throw err;
        //     else {
        //         fs.unlinkSync(`public/images/${result[0].image}`); 
    
    
     pool.query(`update products set ? where id = ?`, [req.body, req.body.id], (err, result) => {
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
    
                res.redirect(`/merchant-api/add-product?vendorid=${req.params.vendorid}&categoryid=${req.params.categoryid}`)
            }
        })
    
    
    })
    


    
router.get('/delete',(req,res)=>{
    pool.query(`delete from products where id = '${req.query.id}'`,(err,result)=>{
        err ? console.log(err) : res.json(result)
    })
})


module.exports = router;
