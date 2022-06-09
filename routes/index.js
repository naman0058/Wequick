var express = require('express');
const pool = require('../routes/pool');
var router = express.Router();



const request = require('request');
const auth = 'bearer 8170b1fc-302d-4f5d-b6a8-72fb6dbdb804'

var mapsdk = require('mapmyindia-sdk-nodejs');


router.post('/reverse-geocoding',(req,res)=>{
let body = req.body;
// res.send(body)
  mapsdk.reverseGeoCodeGivenLatiLongi('a05d263ba2572310eb0bda1777e15526',req.body.latitude,req.body.longitude).then(function(data)
  {
      res.json(data.results[0].formatted_address) 

 

  }).catch(function(ex){
      console.log(ex);
      res.json(ex)
  });
})


router.post('/reverse-geocoding1',(req,res)=>{
  let body = req.body;

  // res.send(body)
    mapsdk.reverseGeoCodeGivenLatiLongi('a05d263ba2572310eb0bda1777e15526',req.body.latitude,req.body.longitude).then(function(data)
    {
      console.log(data.results)
        res.json(data.results[0]) 
  
   
  
    }).catch(function(ex){
        console.log(ex);
        res.json(ex)
    });
  })



const fetch = require("node-fetch");



router.get('/landing-page',(req,res)=>{
  res.render('adpage',{msg:''})
})


router.get('/landing-page-data-show',(req,res)=>{
  pool.query(`select * from landing_data order by id desc`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})

router.post('/enquiry-submit',(req,res)=>{
  let body = req.body;
  console.log('body',body)
  pool.query(`insert into landing_data set ?`,body,(err,result)=>{
    if(err) throw err;
    else res.render('adpage',{msg:'We received your message and you will hear from us soon. Thank You!'})
  })
})


/* GET home page. */
router.get('/', function(req, res, next) {
  req.session.usernumber ? login =  true : login = false

   var query = `select * from category order by name;`
   var query1 = `select * from banner where type = 'Front Banner' order by id desc;`
   var query5 = `select * from banner where type = 'Bottom Banner' order by id desc;`
   var query7 = `select c.* ,
   (select r.id from redeem_code r where r.coupounid = c.id and r.usernumber = '${req.session.usernumber}' and r.vendorid = c.vendorid) as isredeem ,
   (select r.otp from redeem_code r where r.coupounid = c.id and r.usernumber = '${req.session.usernumber}' and r.vendorid = c.vendorid) as userotp 
   from deals c where c.deals_type = 'Exclusive Deals' limit 4;`
   var query8 = `select c.*,
   (select r.id from redeem_code r where r.coupounid = c.id and r.usernumber = '${req.session.usernumber}' and r.vendorid = c.vendorid) as isredeem ,
   (select r.otp from redeem_code r where r.coupounid = c.id and r.usernumber = '${req.session.usernumber}' and r.vendorid = c.vendorid) as userotp 
   from deals c where c.deals_type = 'Deals Of the Day';`
   var query9 = `select c.*,
   (select r.id from redeem_code r where r.coupounid = c.id and r.usernumber = '${req.session.usernumber}' and r.vendorid = c.vendorid) as isredeem ,
   (select r.otp from redeem_code r where r.coupounid = c.id and r.usernumber = '${req.session.usernumber}' and r.vendorid = c.vendorid) as userotp 
   from deals c where c.deals_type = 'Mega Deals';`
   var query10 = `SELECT v.*, SQRT(
    POW(69.1 * (v.latitude - '${req.query.latitude}'), 2) +
    POW(69.1 * (v.longitude - '${req.query.longitude}') * COS(v.latitude / 57.3), 2)) AS distance,
(select c.seo_name from category c where c.id = v.categoryid) as categoryname
    FROM vendor v where v.status = 'approved' and v.image is not null and v.address is not null and v.address!= 'null,null,null,null,null-null' having distance <= 600000000000000 ORDER BY distance limit 8;`

 
   pool.query(query+query1+query5+query7+query8+query9+query10,(err,result)=>{
     if(err) throw err;
     else res.render('index', { title: 'Express',result,login });
   })
  
 });
 





router.get('/product',(req,res)=>{

  pool.query(`select categoryid from products where id = '${req.query.id}'`,(err,result)=>{
    if(err) throw err;
    else {
      let categoryid = result[0].categoryid
  
      req.session.usernumber ? login =  true : login = false

        var query = `select * from category order by name;`
        var query1 = `select p.* 
        from products p where p.id = '${req.query.id}';`
        var query3 = `select * from products order by id desc;`
        var query4 = `select * from products where categoryid = '${categoryid}' and id!= '${req.query.id}' order by id desc limit 8;`
        var query5 = `select * from images where productid = '${req.query.id}';`
        pool.query(query+query1+query3+query4+query5,(err,result)=>{
          if(err) throw err;
          else res.render('view-product', { title: 'Express',login, result : result , productid : req.query.id});
        })
    }
  })
  
  
  })
  
  
  


  router.post("/cart-handler", (req, res) => {
    let body = req.body
  console.log('usern ka number',req.session.ipaddress)
  
  if(req.session.usernumber || req.session.usernumber!= undefined){
    body['usernumber'] = req.session.usernumber;
  
    console.log(req.body)
    if (req.body.quantity == "0" || req.body.quantity == 0) {
    pool.query(`delete from cart where booking_id = '${req.body.booking_id}' and  usernumber = '${req.body.usernumber}' and status is null`,(err,result)=>{
        if (err) throw err;
        else {
          res.json({
            msg: "updated sucessfully",
          });
        }
    })
    }
    else {
        pool.query(`select oneprice from cart where booking_id = '${req.body.booking_id}' and  categoryid = '${req.body.categoryid}' and usernumber = '${req.body.usernumber}' and status is null`,(err,result)=>{
            if (err) throw err;
            else if (result[0]) {
               // res.json(result[0])
                pool.query(`update cart set quantity = ${req.body.quantity} , price = ${result[0].oneprice}*${req.body.quantity} , dp_price = ${req.body.price}*${req.body.quantity}  where booking_id = '${req.body.booking_id}' and categoryid = '${req.body.categoryid}' and usernumber = '${req.body.usernumber}'`,(err,result)=>{
                    if (err) throw err;
                    else {
                        res.json({
                          msg: "updated sucessfully",
                        });
                      }
  
                })
            }
            else {
              body["price"] = (req.body.price)*(req.body.quantity)
              body["dp_price"] = (req.body.price)*(req.body.quantity)
                 pool.query(`insert into cart set ?`, body, (err, result) => {
                 if (err) throw err;
                 else {
                   res.json({
                     msg: "updated sucessfully",
                   });
                 }
               });
  
            }
  
        })
    }
  }
  else {
  
  
  
    if(req.session.ipaddress){
      body['usernumber'] = req.session.ipaddress;
  
      console.log(req.body)
      if (req.body.quantity == "0" || req.body.quantity == 0) {
      pool.query(`delete from cart where booking_id = '${req.body.booking_id}' and  usernumber = '${req.body.usernumber}' and status is null`,(err,result)=>{
          if (err) throw err;
          else {
            res.json({
              msg: "updated sucessfully",
            });
          }
      })
      }
      else {
          pool.query(`select oneprice from cart where booking_id = '${req.body.booking_id}' and  categoryid = '${req.body.categoryid}' and usernumber = '${req.body.usernumber}' and status is null`,(err,result)=>{
              if (err) throw err;
              else if (result[0]) {
                 // res.json(result[0])
                  pool.query(`update cart set quantity = ${req.body.quantity} , price = ${result[0].oneprice}*${req.body.quantity} , dp_price = ${req.body.price}*${req.body.quantity}   where booking_id = '${req.body.booking_id}' and categoryid = '${req.body.categoryid}' and usernumber = '${req.body.usernumber}'`,(err,result)=>{
                      if (err) throw err;
                      else {
                          res.json({
                            msg: "updated sucessfully",
                          });
                        }
    
                  })
              }
              else {
                body["price"] = (req.body.price)*(req.body.quantity)
              body["dp_price"] = (req.body.price)*(req.body.quantity)

                   pool.query(`insert into cart set ?`, body, (err, result) => {
                   if (err) throw err;
                   else {
                     res.json({
                       msg: "updated sucessfully",
                     });
                   }
                 });
    
              }
    
          })
      }
    
  
  
    }
  
    else {
  
      var otp =   Math.floor(100000 + Math.random() * 9000);
      req.session.ipaddress = otp;
      body['usernumber'] = otp;
      console.log(req.body)
      if (req.body.quantity == "0" || req.body.quantity == 0) {
      pool.query(`delete from cart where booking_id = '${req.body.booking_id}' and  usernumber = '${req.body.usernumber}' and status is null`,(err,result)=>{
          if (err) throw err;
          else {
            res.json({
              msg: "updated sucessfully",
            });
          }
      })
      }
      else {
          pool.query(`select oneprice from cart where booking_id = '${req.body.booking_id}' and  categoryid = '${req.body.categoryid}' and usernumber = '${req.body.usernumber}' and status is null`,(err,result)=>{
              if (err) throw err;
              else if (result[0]) {
                 // res.json(result[0])
                  pool.query(`update cart set quantity = ${req.body.quantity} , price = ${result[0].oneprice}*${req.body.quantity} , dp_price = ${req.body.price}*${req.body.quantity}  where booking_id = '${req.body.booking_id}' and categoryid = '${req.body.categoryid}' and usernumber = '${req.body.usernumber}'`,(err,result)=>{
                      if (err) throw err;
                      else {
                          res.json({
                            msg: "updated sucessfully",
                          });
                        }
    
                  })
              }
              else {
                body["price"] = (req.body.price)*(req.body.quantity)
              body["dp_price"] = (req.body.price)*(req.body.quantity)

                   pool.query(`insert into cart set ?`, body, (err, result) => {
                   if (err) throw err;
                   else {
                     res.json({
                       msg: "updated sucessfully",
                     });
                   }
                 });
    
              }
    
          })
      }
    
  
  
    }
  
  
   
  
  }
  
  
  
  })



 
// router.get('/mycart',(req,res)=>{
//   console.log(req.session.ipaddress)
 
//   req.session.usernumber ? login =  true : login = false

//      var query = `select * from category order by name;`
//      var query1 = `select c.* , 
//      (select p.name from products p where p.id = c.booking_id) as bookingname,
//      (select p.image from products p where p.id = c.booking_id) as bookingimage,
//      (select p.quantity from products p where p.id = c.booking_id) as availablequantity
//      from cart c where c.usernumber = '${req.session.usernumber}' or c.usernumber = '${req.session.ipaddress}' ;`
//     var query2 = `select sum(price) as totalprice from cart where usernumber = '${req.session.usernumber}' or usernumber = '${req.session.ipaddress}' ;`              
 
 
//      pool.query(query+query1+query2,(err,result)=>{
//        if(err) throw err;
//        else if(result[1]){
//         res.render('emptyCart',{login,result,shipping_charges:0})
//        }
//        else{
// //  res.json(result[1])
//         res.render('cart', { title: 'Express',login,result , shipping_charges : 0 });
    
//        }
    
    
//         })
 
   
//  })



router.get('/mycart',(req,res)=>{

  console.log(req.session.ipaddress)
 
   if(req.session.usernumber){
     var query = `select * from category order by id desc;`
     var query1 = `select c.* , 
     (select p.name from products p where p.id = c.booking_id) as bookingname,
     (select p.image from products p where p.id = c.booking_id) as bookingimage,
     (select p.quantity from products p where p.id = c.booking_id) as availablequantity
     
 
     
      from cart c where c.usernumber = '${req.session.usernumber}';`
    var query2 = `select sum(price) as totalprice from cart where usernumber = '${req.session.usernumber}';`              
 
 
     pool.query(query+query1+query2,(err,result)=>{
       if(err) throw err;
       else{
 
 if(result[2][0].totalprice > 500) {
   res.render('cart', { title: 'Express',login:true,result , shipping_charges : 0 });
 
 }
 else {
   res.render('cart', { title: 'Express',login:true,result , shipping_charges : 500 });
 
 }
 
    
       }
    
    
        })
 
   }
   else{
     var query = `select * from category order by id desc;`
     var query1 = `select c.* , 
     (select p.name from products p where p.id = c.booking_id) as bookingname,
     (select p.image from products p where p.id = c.booking_id) as bookingimage,
     (select p.quantity from products p where p.id = c.booking_id) as availablequantity
 
     
      from cart c where c.usernumber = '${req.session.ipaddress}';`
    var query2 = `select sum(price) as totalprice from cart where usernumber = '${req.session.ipaddress}';`              
 
     pool.query(query+query1+query2,(err,result)=>{
       if(err) throw err;
       else{
      
 
         if(result[2][0].totalprice > 500) {
           res.render('cart', { title: 'Express',login:false,result , shipping_charges : 0 });
         
         }
         else {
           res.render('cart', { title: 'Express',login:false,result , shipping_charges : 500 });
         
         }
         
    
       }
    
    
        })
 
   }
 })
   
   




router.post('/add-to-cart',(req,res)=>{
  let body = req.body
  console.log('data',req.body)
  console.log(req.session.usernumber)
  if(req.session.usernumber || req.session.usernumber!= undefined){


if(req.body.quantity=='0' || req.body.quantity==0){
  pool.query(`delete from cart where booking_id = '${req.body.booking_id}' and number = '${req.session.usernumber}'`,(err,result)=>{
    if(err) throw err;
    else {
      res.json({
        msg : 'success'
      })
    }
  })
}
else{
  body['number'] = req.session.usernumber
  pool.query(`select * from cart where booking_id = '${req.body.booking_id}' and number = '${req.session.usernumber}'`,(err,result)=>{
    if(err) throw err;
    else if(result[0]) {
        pool.query(`update cart set quantity =  ${req.body.quantity} , price = ${result[0].oneprice}*${req.body.quantity} where booking_id = '${req.body.booking_id}' and number = '${req.session.usernumber}' `,(err,result)=>{
          if(err) throw err;
          else {
            res.json({
              msg : 'success'
            })
          }
        })
    }
    else {
     pool.query(`insert into cart set ?`,body,(err,result)=>{
          if(err) throw err;
          else {
            res.json({
              msg : 'success'
            })
          }
        
     })
    }
  })
}



 
  }
  else{

  if(req.session.ipaddress){



    if(req.body.quantity=='0' || req.body.quantity==0){
      pool.query(`delete from cart where booking_id = '${req.body.booking_id}' and usernumber = '${req.session.ipaddress}'`,(err,result)=>{
        if(err) throw err;
        else {
          res.json({
            msg : 'success'
          })
        }
      })
    }

    else {
      body['number'] = req.session.ipaddress;
      pool.query(`select * from cart where booking_id = '${req.body.booking_id}' and number = '${req.session.usernumber}`,(err,result)=>{
        if(err) throw err;
        else if(result[0]) {
            pool.query(`update cart set quantity =  ${req.body.quantity} , price = ${result[0].oneprice}*${req.body.quantity} where booking_id = '${req.body.booking_id}' and number = '${req.session.ipaddress}' `,(err,result)=>{
              if(err) throw err;
              else {
                res.json({
                  msg : 'success'
                })
              }
            })
        }
        else {
         pool.query(`insert into cart set ?`,body,(err,result)=>{
              if(err) throw err;
              else {
                res.json({
                  msg : 'success'
                })
              }
            
         })
        }
      })
    }

  
  
    


  }
  else{
    var otp =   Math.floor(100000 + Math.random() * 9000);
    req.session.ipaddress = otp;
    body['number'] = otp;
    pool.query(`select * from cart where booking_id = '${req.body.booking_id}'`,(err,result)=>{
      if(err) throw err;
      else if(result[0]) {
          pool.query(`update cart set quantity =  ${req.body.quantity} , price = ${result[0].oneprice}*${req.body.quantity} where booking_id = '${req.body.booking_id}' `,(err,result)=>{
            if(err) throw err;
            else {
              res.json({
                msg : 'success'
              })
            }
          })
      }
      else {
       pool.query(`insert into cart set ?`,body,(err,result)=>{
            if(err) throw err;
            else {
              res.json({
                msg : 'success'
              })
            }
          
       })
      }
    })
    


  }

    
   

  }
})









router.get('/delete',(req,res)=>{
  pool.query(`delete from cart where id = '${req.query.id}'`,(err,result)=>{
    if(err) throw err;
    else {
      pool.query(`select * from cart`,(err,result)=>{
        if(err) throw err;
        else{
         res.render('cart', { title: 'Express',login:'true',result });
     
        }
     
     
         })
    }
  })
})



router.get('/checkout',(req,res)=>{

console.log('hd',req.session.usernumber)

  if(req.session.usernumber){


    pool.query(`select email from users where number = '${req.session.usernumber}'`,(err,result)=>{
      if(err) throw err;
      
      else {
        var query = `select * from category order by name;`
   
        var query1 = `select c.* ,
                     (select p.name from products p where p.id = c.booking_id) as bookingname
                     from cart c where c.usernumber = '${req.session.usernumber}';`
        var query2 = `select sum(price) as totalprice from cart where usernumber = '${req.session.usernumber}';`  
        var query3 = `select * from address where usernumber = '${req.session.usernumber}';` 
        var query4 = `select name,email from users where number = '${req.session.usernumber}'`           
        
     
         pool.query(query+query1+query2+query3+query4,(err,result)=>{
           if(err) throw err;
           else {
     
     
            // res.json(result)
             req.session.totalprice = result[2][0].totalprice
     
     
     if((+req.session.totalprice) > 500) {
       shipping_charges = 0
     }
     else {
      shipping_charges = 500
     }
     
              res.render('checkout', { title: 'Express',login:true , result : result , shipping_charges });
           } 
         })
      }
    })

 
   

  }
  else{
    req.session.page = '1'
    res.redirect('/login')
  }
})









router.post('/order-now',(req,res)=>{
  let body = req.body;
// console.log('body',req.body)
  let cartData = req.body

  console.log('CardData',cartData)
  if(req.body.payment_mode == 'online') {

    req.session.userfirstname =  req.body.first_name;
  
    req.session.address1 = req.body.address1;
    req.session.address2 = req.body.address2;
    req.session.city = req.body.city;
    req.session.state = req.body.state;
    req.session.pincode = req.body.pincode;
    // req.session.time = req.body.time;
    req.session.payment_mode = req.body.payment_mode;
   
   
    if((+req.session.totalprice) > 500) {
      amount = req.session.totalprice
    }
    else {
     amount = (+req.session.totalprice) + 500
    }


    const url = `https://rzp_live_wdTkjI7Ba4b5qN:rxR0Prlwb9Gz7HctbrpukFOe@api.razorpay.com/v1/orders/`;
    const data = {
      amount: amount* 100, // amount in the smallest currency unit
      //amount:100,
      currency: "INR",
      payment_capture: true,
    };
    console.log("data", data);
    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch(url, options)
      .then((res) => res.json())
      .then((resu) => {
          //  res.render('open',{resu : resu.id})
           res.json(resu)
      })

  }
  else{


    console.log('CardData',cartData)

       body['status'] = 'pending'
        
    
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
    
    
    
      var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var result = '';
      for ( var i = 0; i < 12; i++ ) {
          result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
      }
     orderid = result;
    
    
        body['address'] = req.body.address1 + ',' + req.body.address2 + ',' + req.body.city + ',' + req.body.state + ',' + req.body.pincode;
        body['name'] = req.body.first_name  ;
    
    
     console.log(req.body)
    
    
     pool.query(`select * from cart where usernumber = '${req.session.usernumber}'`,(err,result)=>{
         if(err) throw err;
         else {
    
         let data = result
    
         for(i=0;i<result.length;i++){
          data[i].name = req.body.name
          data[i].date = today
          data[i].orderid = orderid
          data[i].status = 'pending'
          data[i].number = req.session.usernumber
          data[i].usernumber = req.session.usernumber
          data[i].payment_mode = 'cash'
          data[i].address = req.body.address
          data[i].id = null
          data[i].pincode = req.body.pincode
          data[i].order_date = today
          
          // data[i].time = req.body.time

          if((+data[i].price) > 500){
            data[i].price = data[i].price
            data[i].shipping_charges = 0
          }
          else{
          data[i].price = (+data[i].price) + 500;
          data[i].shipping_charges = 500
          }
    
    
         }
    
    
       
    
    for(i=0;i<data.length;i++) {
      console.log('quantity1',data[i])
    
    let quantity = data[i].quantity;
    let booking_id = data[i].booking_id;
    
     pool.query(`insert into booking set ?`,data[i],(err,result)=>{
             if(err) throw err;
             else {
        
    
    pool.query(`update products set quantity = quantity - ${quantity} where id = '${booking_id}'`,(err,result)=>{
     if(err) throw err;
     else {
    
     }
    
    })
    
             }
        })
    }
    
    
      
    
    
    pool.query(`delete from cart where usernumber = '${req.session.usernumber}'`,(err,result)=>{
      if(err) throw err;
      else {
        pool.query(`select sum(dp_price) as totaldp from booking where orderid = '${orderid}'`,(err,result)=>{
          if(err) throw err;
          else {
          
         res.redirect('/my-account#account-orders')
        
          }
        })
        
      }
    })
    
    
         }
     })

  }

  

 
})



router.get('/my-account',(req,res)=>{
  if(req.session.usernumber){
    req.session.page = null;
    var query = `select * from category order by name;`
    var query1 = `select b.* , (select p.name from products p where p.id = b.booking_id) as bookingname,
    (select p.image from products p where p.id = b.booking_id) as bookingimage
    from booking b where usernumber = '${req.session.usernumber}' order by id desc limit 8 ;`
    var query2 = `select * from users where number = '${req.session.usernumber}';`
    var query3 = `select * from address where usernumber = '${req.session.usernumber}';`
    var query4 = `select email from users where number = '${req.session.usernumber}';`
    var query5 = `select r.* , 
    (select v.business_name from vendor v where v.id = r.vendorid) as vendorbusinessname,
    (select c.short_description from deals c where c.id = r.coupounid ) as coupon_description,
    (select c.maximum_cashback_price from deals c where c.id = r.coupounid ) as coupon_cashprice,
    (select c.image from deals c where c.id = r.coupounid ) as coupon_image


    from redeem_code r where usernumber = '${req.session.usernumber}' order by id desc limit 10;`

    pool.query(query+query1+query2+query3+query4+query5,(err,result)=>{
      if(err) throw err;
      else res.render('myaccount',{result:result,login:true})
      // else res.json(result[5])
    })
  }
  else{
    req.session.page = null;
  res.redirect('/login')
  }
 
})




router.get('/shop',(req,res)=>{
  var query = `select * from category order by name;`
  var query1 = `select * from products where categoryid = '${req.query.categoryid}';`
  pool.query(query+query1,(err,result)=>{
    if(err) throw err;
    else  res.render('shop',{result:result.log})
  })
 
})



router.get('/search',(req,res)=>{


  req.session.usernumber ? login =  true : login = false

  var query = `select * from category order by name;`
  var query1 = `select * from category where name LIKE '%${req.query.search}%';`
  var query2 = `SELECT *, SQRT(
    POW(69.1 * (latitude - '${req.query.latitude}'), 2) +
    POW(69.1 * (longitude - '${req.query.longitude}') * COS(latitude / 57.3), 2)) AS distance
    FROM vendor where business_name Like '%${req.query.search}%' and status= 'approved'  and image is not null and address is not null having  distance <= 600000000000000 ORDER BY distance;`
  // var query2 = `select * from products where name Like '%${req.query.search}%'  ;`
  

  pool.query(query+query2+query1,(err,result)=>{
    if(err) throw err;
    else if(result[1][0] || result[2][0]){
       res.render('search',{login,result,search:req.query.search})
    }
    else res.render('nodatafound',{login,result,search:req.query.search})
  })
 
})




router.get("/payment", (req, res) => {
  const url = `https://rzp_live_wdTkjI7Ba4b5qN:rxR0Prlwb9Gz7HctbrpukFOe@api.razorpay.com/v1/orders/`;
  const data = {
    amount: 100 * 100, // amount in the smallest currency unit
    //amount:100,
    currency: "INR",
    payment_capture: true,
  };
  console.log("data", data);
  const options = {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  };
  fetch(url, options)
    .then((res) => res.json())
    .then((resu) => res.send(resu));
});




router.get('/view-all-product',(req,res)=>{

  req.session.usernumber ? login =  true : login = false

    var query = `select * from category order by name;`
    var query1 = `select t.* ,   
    (select p.name from products p where p.id = t.productid) as productname,
    (select p.price from products p where p.id = t.productid) as productprice,
    (select p.quantity from products p where p.id = t.productid) as productquantity,
    (select p.discount from products p where p.id = t.productid) as productdiscount,
    (select p.image from products p where p.id = t.productid) as productimage,
    (select p.categoryid from products p where p.id = t.productid) as productcategoryid,
    (select p.subcategoryid from products p where p.id = t.productid) as productsubcategoryid,
    (select p.net_amount from products p where p.id = t.productid) as productnetamount 
    from promotional_text_management t where t.bannerid = '${req.query.id}' order by productquantity desc `
    pool.query(query+query1,(err,result)=>{
      if(err) throw err;
      else if(result[1][0]) res.render('view_all_product',{result:result,login})
      else  res.render('not_found',{result,login})
    })

})












router.post('/myaccount-update', (req, res) => {
  console.log(req.body)
  pool.query(`update users set ? where number = ?`, [req.body, req.body.number], (err, result) => {
      if(err) {
          res.json({
              status:500,
              type : 'error',
              description:err
          })
      }
      else {

  if(req.session.newuser){
    req.session.newuser = null;
        res.redirect('/checkout')
  }
  else {
    res.redirect('/my-account#account-details')

  }


          
      }
  })
})




router.get('/wishlist',(req,res)=>{
  if(req.session.usernumber){
    var query = `select * from category order by name;`
    var query1 = `select t.*,
    (select p.name from products p where p.id = t.booking_id) as productname,
    (select p.price from products p where p.id = t.booking_id) as productprice,
    (select p.quantity from products p where p.id = t.booking_id) as productquantity,
    (select p.discount from products p where p.id = t.booking_id) as productdiscount,
    (select p.image from products p where p.id = t.booking_id) as productimage,
    (select p.categoryid from products p where p.id = t.booking_id) as productcategoryid,
    (select p.subcategoryid from products p where p.id = t.booking_id) as productsubcategoryid,
    (select p.net_amount from products p where p.id = t.booking_id) as productnetamount ,
    (select c.quantity from cart c where c.booking_id = t.booking_id and c.usernumber = '${req.session.usernumber}'  ) as userquantity
    from wishlist t where usernumber = '${req.session.usernumber}';`
    pool.query(query+query1,(err,result)=>{
      if(err) throw err;
      else res.render('wishlist',{result ,login:true})
    })
  }
 
  else{
   res.redirect('/login')
  }
 
 
})




router.get('/logout',(req,res)=>{
  req.session.usernumber = null;
  req.session.ipaddress = null;
  res.redirect('/login')
})
 

router.get('/edit/address',(req,res)=>{
  pool.query(`select * from address where id ='${req.query.id}'`,(err,result)=>{
    if(err) throw err;
    else res.render('edit-address',{result})
  })
})










router.get('/website-customization',(req,res)=>{
  res.render('website_customization')
})



router.get('/faq-customization',(req,res)=>{
  res.render('faq_customization')
})




router.post('/faq-insert',(req,res)=>{
  let body = req.body
  pool.query(`insert into faq set ?`,body,(err,result)=>{
    if(err) throw err;
    else res.json({
      msg : 'success'
    })
  })
})



router.post('/website-customization-insert',(req,res)=>{
  let body = req.body   
  pool.query(`select * from website_customize where name = '${req.body.name}'`,(err,result)=>{
    if(err) throw err;
    else if(result[0]){
      res.json({
        msg : 'Already Inserted'
      })
    }
    else {
      pool.query(`insert into website_customize set ?`,body,(err,result)=>{
        if(err) throw err;
        else res.json({
          msg : 'success'
        })
      })
    }
  })
})









router.get('/shop-by-category',(req,res)=>{
  req.session.usernumber ? login =  true : login = false
  var query = `select * from category;`
  var query1 = `SELECT v.*, SQRT(
    POW(69.1 * (latitude - '${req.query.latitude}'), 2) +
    POW(69.1 * (longitude - '${req.query.longitude}') * COS(latitude / 57.3), 2)) AS distance,
    (select c.name from category c where c.id = '${req.query.categoryid}') as categoryname,
    (select c.icon from category c where c.id = '${req.query.categoryid}') as categorylogo,
    (select p.image from portfolio p where p.vendorid = v.id limit 1 ) as vendor_image
    FROM vendor v where v.status= 'approved' and v.categoryid = '${req.query.categoryid}' and v.image is not null and v.address is not null and v.address!= 'null,null,null,null,null-null' having distance <= 600000000000000 ORDER BY distance;`
  
    pool.query(query+query1,(err,result)=>{
      if(err) throw err;
      else if(result[1][0]){
        res.render('allshop',{login,result})
        // res.json(result[1][2].image)
         }
      else res.render('nodatafound',{login,result})
    })
  
})





router.get('/segment/:name',(req,res)=>{
  req.session.usernumber ? login =  true : login = false
  var query = `select * from category;`
  var query1 = `SELECT v.*, SQRT(
    POW(69.1 * (latitude - '${req.query.latitude}'), 2) +
    POW(69.1 * (longitude - '${req.query.longitude}') * COS(latitude / 57.3), 2)) AS distance,
    (select c.name from category c where c.seo_name = '${req.params.name}') as categoryname,
    (select c.icon from category c where c.seo_name = '${req.params.name}') as categorylogo,
    (select p.image from portfolio p where p.vendorid = v.id limit 1 ) as vendor_image
    FROM vendor v where v.status= 'approved' and v.categoryid = (select c.id from category c where c.seo_name = '${req.params.name}') and v.image is not null and v.address is not null and v.address!= 'null,null,null,null,null-null' having distance <= 600000000000000 ORDER BY distance;`
  
    pool.query(query+query1,(err,result)=>{
      if(err) throw err;
      else if(result[1][0]){
        res.render('allshop',{login,result,name:req.params.name})
        // res.json(result[1][2].image)
         }
      else res.render('nodatafound',{login,result,name:req.params.name})
    })
  
})




router.get('/single-vendor-details',(req,res)=>{
  req.session.usernumber ? login =  true : login = false

  var today = new Date();

var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = yyyy + '-' + mm + '-' + dd;



    var query = `select * from category;`
    var query5 = `select * from products where vendorid = '${req.query.vendorid}';`
    var query1 = `select v.* ,
     (select c.name from category c where c.id = v.categoryid) as categoryname,
     (select p.image from portfolio p where p.vendorid = v.id limit 1 ) as vendor_image
     from vendor v where v.id = '${req.query.vendorid}';`
    var query2 = `select c.* , 
     (select r.id from redeem_code r where r.coupounid = c.id and r.usernumber = '${req.session.usernumber}' and r.vendorid = c.vendorid) as isredeem ,
     (select r.otp from redeem_code r where r.coupounid = c.id and r.usernumber = '${req.session.usernumber}' and r.vendorid = c.vendorid) as userotp 
     
     from coupon c where c.vendorid = '${req.query.vendorid}';`
    var query3 = `select * from coupon where vendorid = '${req.query.vendorid}';`
    var query4 = `select * from rating where vendorid = '${req.query.vendorid}';`


    var query7 = `select c.* ,
    (select r.id from redeem_code r where r.coupounid = c.id and r.usernumber = '${req.session.usernumber}' and r.vendorid = c.vendorid) as isredeem ,
    (select r.otp from redeem_code r where r.coupounid = c.id and r.usernumber = '${req.session.usernumber}' and r.vendorid = c.vendorid) as userotp 
    from deals c where c.deals_type = 'Exclusive Deals' and c.vendorid = '${req.query.vendorid}';`
    var query8 = `select c.*,
    (select r.id from redeem_code r where r.coupounid = c.id and r.usernumber = '${req.session.usernumber}' and r.vendorid = c.vendorid) as isredeem ,
    (select r.otp from redeem_code r where r.coupounid = c.id and r.usernumber = '${req.session.usernumber}' and r.vendorid = c.vendorid) as userotp 
    from deals c where c.deals_type = 'Deals Of the Day' and c.vendorid = '${req.query.vendorid}' ;`
    var query9 = `select c.*,
    (select r.id from redeem_code r where r.coupounid = c.id and r.usernumber = '${req.session.usernumber}' and r.vendorid = c.vendorid) as isredeem ,
    (select r.otp from redeem_code r where r.coupounid = c.id and r.usernumber = '${req.session.usernumber}' and r.vendorid = c.vendorid) as userotp 
    from deals c where c.deals_type = 'Mega Deals' and c.vendorid = '${req.query.vendorid}';`
  

    pool.query(`update vendor set viewers = viewers + 1 where id = '${req.query.vendorid}'`,(err,result)=>{
      if(err) throw err;
      else {
        pool.query(`insert into viewers(vendorid,date,viewers) values('${req.query.vendorid}' , '${today}' , '1')`,(err,result)=>{
          if(err) throw err;
          else{
            pool.query(query+query1+query2+query3+query4+query5+query7+query8+query9,(err,result)=>{
              if(err) throw err;
              else {
                res.render('single-vendor-details',{login,result})
              }
            })
  
          }
        })
      }
    })

})




router.get('/segment/:name/:segmentname/:vendorid',(req,res)=>{
  req.session.usernumber ? login =  true : login = false

  var today = new Date();

var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = yyyy + '-' + mm + '-' + dd;



    var query = `select * from category;`
    var query5 = `select * from products where vendorid = '${req.params.vendorid}';`
    var query1 = `select v.* ,
     (select c.name from category c where c.id = v.categoryid) as categoryname,
     (select p.image from portfolio p where p.vendorid = v.id limit 1 ) as vendor_image
     from vendor v where v.id = '${req.params.vendorid}';`
    var query2 = `select c.* , 
     (select r.id from redeem_code r where r.coupounid = c.id and r.usernumber = '${req.session.usernumber}' and r.vendorid = c.vendorid) as isredeem ,
     (select r.otp from redeem_code r where r.coupounid = c.id and r.usernumber = '${req.session.usernumber}' and r.vendorid = c.vendorid) as userotp 
     
     from coupon c where c.vendorid = '${req.params.vendorid}';`
    var query3 = `select * from coupon where vendorid = '${req.params.vendorid}';`
    var query4 = `select * from rating where vendorid = '${req.params.vendorid}';`


    var query7 = `select c.* ,
    (select r.id from redeem_code r where r.coupounid = c.id and r.usernumber = '${req.session.usernumber}' and r.vendorid = c.vendorid) as isredeem ,
    (select r.otp from redeem_code r where r.coupounid = c.id and r.usernumber = '${req.session.usernumber}' and r.vendorid = c.vendorid) as userotp 
    from deals c where c.deals_type = 'Exclusive Deals' and c.vendorid = '${req.params.vendorid}';`
    var query8 = `select c.*,
    (select r.id from redeem_code r where r.coupounid = c.id and r.usernumber = '${req.session.usernumber}' and r.vendorid = c.vendorid) as isredeem ,
    (select r.otp from redeem_code r where r.coupounid = c.id and r.usernumber = '${req.session.usernumber}' and r.vendorid = c.vendorid) as userotp 
    from deals c where c.deals_type = 'Deals Of the Day' and c.vendorid = '${req.params.vendorid}' ;`
    var query9 = `select c.*,
    (select r.id from redeem_code r where r.coupounid = c.id and r.usernumber = '${req.session.usernumber}' and r.vendorid = c.vendorid) as isredeem ,
    (select r.otp from redeem_code r where r.coupounid = c.id and r.usernumber = '${req.session.usernumber}' and r.vendorid = c.vendorid) as userotp 
    from deals c where c.deals_type = 'Mega Deals' and c.vendorid = '${req.params.vendorid}';`
  

    pool.query(`update vendor set viewers = viewers + 1 where id = '${req.params.vendorid}'`,(err,result)=>{
      if(err) throw err;
      else {
        pool.query(`insert into viewers(vendorid,date,viewers) values('${req.params.vendorid}' , '${today}' , '1')`,(err,result)=>{
          if(err) throw err;
          else{
            pool.query(query+query1+query2+query3+query4+query5+query7+query8+query9,(err,result)=>{
              if(err) throw err;
              else {
                res.render('single-vendor-details',{login,result})
              }
            })
  
          }
        })
      }
    })

})




router.get('/exclusive-deals-and-offers',(req,res)=>{
  req.session.usernumber ? login =  true : login = false

    var query = `select * from category;`
    var query1 = `select * from category;`
    pool.query(query+query1,(err,result)=>{
      if(err) throw err;
      else res.render('show_all_category',{login,result})
    })
 
})




router.get('/about-us',(req,res)=>{
  req.session.usernumber ? login =  true : login = false

    var query = `select * from category;`
    var query1 = `select * from category;`
    pool.query(query+query1,(err,result)=>{
      if(err) throw err;
      else res.render('about',{login,result})
    })
 
  
})



router.get('/privacy-policy',(req,res)=>{
  req.session.usernumber ? login =  true : login = false

    var query = `select * from category;`
    var query1 = `select * from category;`
    pool.query(query+query1,(err,result)=>{
      if(err) throw err;
      else res.render('privacy',{login,result})
    })
 
  
})



router.get('/terms-and-conditions',(req,res)=>{
  req.session.usernumber ? login =  true : login = false

    var query = `select * from category;`
    var query1 = `select * from category;`
    pool.query(query+query1,(err,result)=>{
      if(err) throw err;
      else res.render('terms',{login,result})
    })
 
  
})



router.get('/disclaimer',(req,res)=>{
  req.session.usernumber ? login =  true : login = false

    var query = `select * from category;`
    var query1 = `select * from category;`
    pool.query(query+query1,(err,result)=>{
      if(err) throw err;
      else res.render('disclaimer',{login,result})
    })
 
  
})



router.get('/customer-support',(req,res)=>{
  req.session.usernumber ? login =  true : login = false

    var query = `select * from category;`
    var query1 = `select * from category;`
    pool.query(query+query1,(err,result)=>{
      if(err) throw err;
      else res.render('support',{login,result,msg:''})
    })
 
  
})


router.post('/customer-support/success',(req,res)=>{
  req.session.usernumber ? login =  true : login = false

  let body = req.body;
  console.log(body);
  pool.query(`insert into contact set ?`,body,(err,result)=>{
    if(err) throw err;
    else {
      var query = `select * from category;`
    var query1 = `select * from category;`
    pool.query(query+query1,(err,result)=>{
      if(err) throw err;
      else res.render('support',{login,result,msg:'Our Team Will Contact You As Soon As Possible.'})
    })
    }
  })
})




router.post('/redeem-this-code',(req,res)=>{
  let body = req.body;
  body['usernumber'] = req.session.usernumber;
  body['otp'] = Math.floor(100000 + Math.random() * 9000);
  body['status'] = 'pending'
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  
  today = mm + '/' + dd + '/' + yyyy;



  body['date'] = today

  if(req.session.usernumber){
  pool.query(`insert into redeem_code set ?`,body,(err,result)=>{
    if(err) throw err;
    else res.json({msg:'success'})
  })
  }
  else{
    res.json({msg:'failed'})
  }
})



router.get('/product-description',(req,res)=>{
  pool.query(`select * from products where id = '${req.query.id}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})




router.get('/new-release',(req,res)=>{
  req.session.usernumber ? login =  true : login = false

    var query = `select * from category;`
    var query1 = `select * from blogs order by id desc;`
    pool.query(query+query1,(err,result)=>{
      if(err) throw err;
      else res.render('new_release',{login,result})
    })
  
})


router.get('/new-release-full-description',(req,res)=>{
  req.session.usernumber ? login =  true : login = false
    var query = `select * from category;`
    var query1 = `select * from blogs where id = '${req.query.id}';`
    var query2 = `select * from blogs where id!= '${req.query.id}';`
    pool.query(query+query1+query2,(err,result)=>{
      if(err) throw err;
      else res.render('new_release_full_description',{login,result,id:req.query.id})
    })
  
})





router.get('/get-single-blog-description',(req,res)=>{
  pool.query(`select * from blogs where id = '${req.query.id}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})




router.get('/invoice',(req,res)=>{
  if(req.session.usernumber){
    var query = `select * from category order by name;`
    var query1 = `select c.*,
    (select p.name from products p where p.id = c.booking_id) as bookingname,
    (select p.image from products p where p.id = c.booking_id) as bookingimage,
    (select u.email from users u where u.id = c.usernumber) as usermobilenumber,
    (select v.address from vendor v where v.id = c.vendorid) as vendoraddress,
    (select v.state from vendor v where v.id = c.vendorid) as vendorstate,
    (select v.city from vendor v where v.id = c.vendorid) as vendorcity,
    (select v.pincode from vendor v where v.id = c.vendorid) as vendorpincode,


    (select a.city from address a where a.id = c.address ) as usercity,
    (select a.pincode from address a where a.id = c.address ) as userpostcode,
    (select a.state from address a where a.id = c.address ) as userstate
    from booking c where c.orderid = '${req.query.orderid}';`
    var query10= `select sum(price) as totalamount from booking where orderid = '${req.query.orderid}';`


    var query2 = `select * from category where id = '${req.query.id}';`
    var query6 = `select * from users where number = '${req.session.usernumber}';`
      var query7 = `select sum(quantity) as counter from cart where usernumber = '${req.session.usernumber}';`
      var query8 = `select count(id) as counter from wishlist where usernumber = '${req.session.usernumber}';`


  
  
    pool.query(query+query1+query2+query6+query7+query8+query10,(err,result)=>{
      if(err) throw err;
       else res.render('invoice',{login:true,result,title:'Invoice'})
      // else res.json({msg:result[3], number:req.session.usernumber})
    })
  }
  else{
    res.redirect('/login')
  }
})




router.get('/success',(req,res)=>{
  req.session.usernumber ? login =  true : login = false
    var query = `select * from category;`
    var query1 = `select * from category;`
    pool.query(query+query1,(err,result)=>{
      if(err) throw err;
      else res.render('success',{login,result,id:req.query.id})
    })
  
})





router.get('/faq',(req,res)=>{
  req.session.usernumber ? login =  true : login = false
 var query = `select * from category;`
    var query1 = `select * from category;`
    pool.query(query+query1,(err,result)=>{
      if(err) throw err;
      else res.render('faq',{login,result})
    })
 })


 router.get('/features',(req,res)=>{
  req.session.usernumber ? login =  true : login = false
 var query = `select * from category;`
    var query1 = `select * from category;`
    pool.query(query+query1,(err,result)=>{
      if(err) throw err;
      else res.render('features',{login,result})
    })
 })


 router.get('/robots.txt',(req,res)=>{
  req.session.usernumber ? login =  true : login = false
 var query = `select * from category;`
    var query1 = `select * from category;`
    pool.query(query+query1,(err,result)=>{
      if(err) throw err;
      else res.render('robots',{login,result})
    })
 })





 router.get('/sitemap.xml',(req,res)=>{
  req.session.usernumber ? login =  true : login = false
 var query = `select * from category;`
    var query1 = `select * from category;`
    pool.query(query+query1,(err,result)=>{
      if(err) throw err;
      else res.render('sitemap',{login,result})
    })
 })




 router.get('/event',(req,res)=>{
  req.session.usernumber ? login =  true : login = false
 var query = `select * from category;`
    var query1 = `select * from event;`
    pool.query(query+query1,(err,result)=>{
      if(err) throw err;
      else res.render('event',{login,result})
    })
 })


 
 router.get('/channel-partner',(req,res)=>{
  req.session.usernumber ? login =  true : login = false
 var query = `select * from category;`
    var query1 = `select * from event;`
    pool.query(query+query1,(err,result)=>{
      if(err) throw err;
      else res.render('channel_partner_landing',{login,result,msg:''})
    })
 })



  
 router.post('/channel-partner/save',(req,res)=>{
   let body = req.body;
   console.log(req.body)
  req.session.usernumber ? login =  true : login = false
 
  pool.query(`select * from cp where whatsapp_number = '${req.body.whatsapp_number}'`,(err,result)=>{
    if(err) throw err;
    else if(result[0]){
      res.render('channel_partner_landing',{login,result,msg:'Number Already Exists.'})
    }
    else{
pool.query(`insert into cp set ?`,body,(err,result)=>{
      if(err) throw err;
      else res.redirect('/thankyou')
    })
    }
  })
    
 })


 
 router.get('/thankyou',(req,res)=>{
  req.session.usernumber ? login =  true : login = false
 var query = `select * from category;`
    var query1 = `select * from event;`
    pool.query(query+query1,(err,result)=>{
      if(err) throw err;
      else res.render('cpthankyou',{login,result,msg:''})
    })
 })
 


 router.get('/digital-lead',(req,res)=>{
   pool.query(`select cpa.*, 
   (select s.name from state s where s.id = cpa.state) as statename , 
   (Select c.name from city c where c.id = cpa.city) as cityname
   from cp cpa order by id desc`,(err,result)=>{
     if(err) throw err;
     else res.render('digital_lead',{result})
   })
 })


module.exports = router;
