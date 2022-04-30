var express = require('express');
var router = express.Router();
var pool =  require('./pool');
var upload = require('./multer');
const fetch = require("node-fetch");





router.get('/update-city',(req,res)=>{
  for(i=0;i<cities.length;i++){
    pool.query(`insert into city(name,stateid) values('${cities[i].name}' , '${cities[i].stateid}')`,(err,result)=>{
      if(err) throw err;
      else {
        console.log('su')
      }
    })
  }
})





const request = require('request');
const auth = 'bearer 8170b1fc-302d-4f5d-b6a8-72fb6dbdb804'

var mapsdk = require('mapmyindia-sdk-nodejs');


// mapsdk.autoSuggest('0XXXXXXf-dXX0-4XX0-8XXa-eXXXXXXXXXX6','lovely professional').then(function(res)
// {
//     console.log(JSON.stringify(res));
// }).catch(function(ex){
//     console.log('came in catch');
//     console.log(ex, 'error');
// });



// mapsdk.reverseGeoCodeGivenLatiLongi('33OkryzDZsLQEF71nHZWBN8kuaCLc2oNn5dmt4BHmtoQjeEhM6Fs0ohQj1VcyNqUNxFuNARuMQeSkhabCfK07Q==',26.5645,85.9914).then(function(data)
// {
//    console.log(data.results) 



// }).catch(function(ex){
//     console.log(ex,'error');
// });


//  stripe payment start

const stripe = require('stripe')('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');


router.get('/check-time',(req,res)=>{
  var today = new Date();

console.log(today.getDay())
var arr = ['sunday_time' , 'monday_time' , 'tuesday_time' , 'wednesday_time' , 'thursday_time' , 'friday_time' , 'saturday_time' ]
console.log(arr[today.getDay()])

pool.query(`select ${arr[today.getDay()]} from vendor where id = '${req.query.vendorid}'`,(err,result)=>{
  if(err) throw err;
  else {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    var date = new Date();

    let hours = date.getHours();
    let minutes = date.getMinutes();    
    const ampm = hours >= 12 ? 'pm' : 'am';
  
    hours %= 12;
    hours = hours || 12;    
    minutes = minutes < 10 ? `0${minutes}` : minutes;
  
    const strTime = `${hours}:${minutes} ${ampm}`;
  
    // return strTime;
    // var time1 = hours + ":" + minutes + ":" + seconds;

 diff('8:00','17:00')

    function diff(start, end) {
      start = start.split(":");
      end = end.split(":");
      var startDate = new Date(0, 0, 0, start[0], start[1], 0);
      var endDate = new Date(0, 0, 0, end[0], end[1], 0);
      var diff = endDate.getTime() - startDate.getTime();
      var hours = Math.floor(diff / 1000 / 60 / 60);
      diff -= hours * 1000 * 60 * 60;
      var minutes = Math.floor(diff / 1000 / 60);
  
      // If using time pickers with 24 hours format, add the below line get exact hours
      if (hours < 0)
         hours = hours + 24;
  
      return (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes;
  }

    res.json({result,time,strTime})
  }
})
})






router.get('/check-state',(req,res)=>{
  pool.query(`select * from state where name = '${req.query.name}' and status='active'`,(err,result)=>{
     if(err) throw err;
     else if(result[0]){
       res.json({msg:'active'})
     }
     else{
       res.json({
         msg : 'not active'
       })
     }
  })
})



router.get('/ui',(req,res)=>{
  res.render('ui')
})

router.post("/charge", (req, res) => {
  console.log(req.body)
 

  try {
    stripe.customers
      .create({
        name: req.body.name,
        email: req.body.email,
        source: req.body.stripeToken
      })
      .then(customer =>
        stripe.charges.create({
          amount: req.body.amount * 100,
          currency: "usd",
          customer: customer.id
        })
      )
      .then(() => res.send("thankyou"))
      .catch(err => console.log(err));
  } catch (err) {
    res.send(err);
  }
});




const accountSid = 'ACe8c2bb6560b201780ba9e88014de3d60';
const authToken = '43faf4aec6d09e8fdd664805c90614b9';
const client = require('twilio')('ACe8c2bb6560b201780ba9e88014de3d60', '43faf4aec6d09e8fdd664805c90614b9');


//send whatsapp media done


// client.messages
//       .create({
//          body: `Dealsaaj Boom.`,
//          mediaUrl: ['/images/deal_logo.png'],
//          from: 'whatsapp:+14155238886',
//          to: 'whatsapp:+919019596147'
//        })
//          .then(function(res)
//       {
//           console.log(JSON.stringify(res));
//       }).catch(function(ex){
//           console.log('came in catch');
//           console.log(ex, 'error');
//       });



// ends

// send whatsapp messages done

// client.messages
//       .create({
//          from: 'whatsapp:+14155238886',
//          body: 'Yor are done now!',
//          to: 'whatsapp:+918319339945'
//        })
//     .then(function(res)
//       {
//           console.log(JSON.stringify(res));
//       }).catch(function(ex){
//           console.log('came in catch');
//           console.log(ex, 'error');
//       });


// ends here


router.get('/send-whatsaap',(req,res)=>{
  client.messages
      .create({
         from: 'whatsapp:+919582172786',
         body: 'Hello there!',
         to: 'whatsapp:+918319339945'
       },(err,result)=>{
         if(err) throw err;
         else res.json(result)
       })
     
})
      


//  stripe payment end

router.post('/reverse-geocoding',(req,res)=>{
  let body = req.body;
  // res.send(body)
    mapsdk.reverseGeoCodeGivenLatiLongi('l9fksssn2m6snu4dif9d55z7fpwed1kx',req.body.latitude,req.body.longitude).then(function(data)
    {
        res.json(data.results[0].formatted_address) 
  
   
  
    }).catch(function(ex){
        console.log(ex);
        res.json(ex)
    });
  })





  router.post('/reverse-geocoding1',(req,res)=>{
    let body = req.body;
      mapsdk.reverseGeoCodeGivenLatiLongi('l9fksssn2m6snu4dif9d55z7fpwed1kx',req.body.latitude,req.body.longitude).then(function(data)
      {
          res.json(data.results) 
    
     
    
      }).catch(function(ex){
          console.log(ex);
          res.json(ex)
      });
    })





router.get('/get-brand',(req,res)=>{
    pool.query(`select b.* , 
    (select c.name from category c where c.id = b.categoryid) as categoryname,
    (select s.name from subcategory s where s.id = b.subcategoryid) as subcategoryname
    from brand b order by id desc limit 10`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    }) 
})



router.get('/get-banner-image',(req,res)=>{
    pool.query(`select s.* , (select c.name from category c where c.id = s.categoryid) as categoryname from banner_image s order by id desc limit 10`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    }) 
})






// mobile api



router.get('/get-category',(req,res)=>{
    pool.query(`select * from category order by name`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
   
   })

   router.get('/get-event',(req,res)=>{
    pool.query(`select * from event order by id desc`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
   
   })



   router.get('/get-training',(req,res)=>{
    pool.query(`select * from training order by id desc`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
   
   })




   
router.get('/get-merchant',(req,res)=>{
  pool.query(`select * from vendor order by id desc`,(err,result)=>{
      if(err) throw err;
      else res.json(result)
  })
 
 })



  router.get('/get-state',(req,res)=>{

    pool.query(`select * from state where status = 'active' order by name desc`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
   
   })



   router.get('/get-city',(req,res)=>{
    pool.query(`select * from city where stateid = '${req.query.stateid}' order by name desc`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
   
   })
   




// router.get('/get-all-shops',(req,res)=>{
//   pool.query(`select * from vendor order by id desc`,(err,result)=>{
//     if(err) throw err;
//     else res.json(result)
//   })
// })



router.get('/get-all-shops',(req,res)=>{
  // console.log(req.body)
  var query = `SELECT *, SQRT(
      POW(69.1 * (latitude - '${req.query.latitude}'), 2) +
      POW(69.1 * (longitude - '${req.query.longitude}') * COS(latitude / 57.3), 2)) AS distance
  FROM vendor where status = 'approved' and image is not null and address is not null and address!= 'null,null,null,null,null-null'  having distance <= 60000000000 ORDER BY distance;`


pool.query(query,(err,result)=>{
  if(err) throw err;
      else res.json(result)
})
})


router.get('/get-all-shops-by-category',(req,res)=>{

    var query = `SELECT *, SQRT(
    POW(69.1 * (latitude - '${req.query.latitude}'), 2) +
    POW(69.1 * (longitude - '${req.query.longitude}') * COS(latitude / 57.3), 2)) AS distance
    FROM vendor where categoryid = '${req.query.categoryid}' and image is not null and address is not null and address!= 'null,null,null,null,null-null' having distance <= 600000000000000 ORDER BY distance;`
    pool.query(query,(err,result)=>{
       if(err) throw err;
       else res.json(result)
    })
})



router.get('/get-all-products',(req,res)=>{
  pool.query(`select * from products where vendorid = '${req.query.vendorid}' order by id desc`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})





   router.get('/get-brand',(req,res)=>{
    pool.query(`select * from brand order by name desc `,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
   
   })




   router.get('/get-product',(req,res)=>{
    pool.query(`select * from products order by name desc `,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
   
   })





   
   
   router.get('/get-subcategory',(req,res)=>{
       pool.query(`select s.* , (select c.name from category c where c.id = s.categoryid) as categoryname from subcategory s`,(err,result)=>{
           if(err) throw err;
           else res.json(result)
       }) 
   })
   

   router.get('/get-channel_partner',(req,res)=>{
    pool.query(`select s.* , (select c.name from state c where c.id = s.categoryid) as categoryname,
    (select c.name from city c where c.id = s.subcategoryid) as subcategoryname
    
    from channel_partner s`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    }) 
})


router.get('/get-agent',(req,res)=>{
  pool.query(`select s.* from agent s where s.channel_partner_id = '${req.query.channel_partner_id}'`,(err,result)=>{
      if(err) throw err;
      else res.json(result)
  }) 
})




   router.get('/get-subcategory1',(req,res)=>{
    pool.query(`select s.* , (select c.name from category c where c.id = s.categoryid) as categoryname from subcategory s where s.categoryid = '${req.query.categoryid}'  order by id desc limit 10`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    }) 
})


//    router.get('/get-product',(req,res=>{
//        pool
//    }))




router.get('/product-description',(req,res)=>{

console.log(req.query.id)
// var query = `select * from products where categoryid = '${categoryid}' and id!= '${req.query.id}' order by id desc limit 8;`

  pool.query(`select * from products where id  = '${req.query.id}'`,(err,result)=>{
    if(err) throw err;
    else {
      console.log(result)
      let category = result[0].categoryid


      var query = `select p.* , 
    (select c.quantity from cart c where c.booking_id = '${req.query.id}' and c.usernumber = '${req.query.number}' ) as userquantity
      
      from products p  where p.id = '${req.query.id}';`
      var query1 = `select * from images where productid = '${req.query.id}';`
      var query2 = `select image , price , discount , net_amount , small_description , name , id  from products where categoryid = '${category}' and id!= '${req.query.id}';`
      var query3 = `select custom_refund , custom_terms from vendor where id = '${req.query.vendorid}';`
     
      pool.query(query+query1+query2+query3,(err,result)=>{
          if(err) throw err;
          else res.json(result)
      })
    }
  })

})



router.get('/get-address',(req,res)=>{
    pool.query(`select * from address where usernumber = '${req.query.usernumber}'`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
})



router.post('/save-address',(req,res)=>{
    let body = req.body;
    console.log('body h',req.body)
    pool.query(`insert into address set ?`,body,(err,result)=>{
        if(err) throw err;
        else res.json({
            msg : 'success'
        })
    })
})



router.post("/cart-handler", (req, res) => {
    let body = req.body
    console.log(req.body)
    if (req.body.quantity == "0" || req.body.quantity == 0) {
    pool.query(`delete from cart where booking_id = '${req.body.booking_id}' and  usernumber = '${req.body.usernumber}'`,(err,result)=>{
        if (err) throw err;
        else {
          res.json({
            msg: "updated sucessfully",
          });
        }
    })
    }
    else {
        pool.query(`select oneprice from cart where booking_id = '${req.body.booking_id}' and  categoryid = '${req.body.categoryid}' and usernumber = '${req.body.usernumber}' `,(err,result)=>{
            if (err) throw err;
            else if (result[0]) {
               // res.json(result[0])
                pool.query(`update cart set quantity = ${req.body.quantity} , price = ${result[0].oneprice}*${req.body.quantity}  where booking_id = '${req.body.booking_id}' and categoryid = '${req.body.categoryid}' and usernumber = '${req.body.usernumber}'`,(err,result)=>{
                    if (err) throw err;
                    else {
                        res.json({
                          msg: "updated sucessfully",
                        });
                      }

                })
            }
            else {
                body['oneprice'] = req.body.price
              body["price"] = (req.body.price)*(req.body.quantity)
          
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

})




router.get('/myorder',(req,res)=>{
    pool.query(`select * from booking where usernumber = '${req.query.number}' order by date desc`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
})



router.post('/save-user',(req,res)=>{
    let body =  req.body;


    pool.query(`select * from users where number = '${req.body.number}'`,(err,result)=>{
        if(err) throw err;
        else if(result[0]){
         res.json({
            msg : 'success'

         })
        }
        else {
            pool.query(`insert into users set ?`,body,(err,result)=>{
                if(err) throw err;
                else{
                    res.json({
                        msg : 'success'
                    })

//                 request.get({url:`https://pgapi.vispl.in/fe/api/v1/send?username=aformotpg.trans&password=z3xZ7&unicode=false&from=DLSAAJ&to=${req.body.number}&dltContentId=1307165008026255744&text=Congratulations! You have created an account with DealsAaj. Thank you for choosing us. Here is a complimentary reward from us 1564 -<DealsAaj>`} , function(err,data){

                  
   
//  })                                                                          
}
               
            })
        }
    })

   
})




router.post("/mycart", (req, res) => {
 console.log(req.body)
    var query = `select c.*,(select s.name from products s where s.id = c.booking_id) as servicename
    ,(select s.image from products s where s.id = c.booking_id) as productlogo,
    (select s.quantity from products s where s.id = c.booking_id) as productquantity
    from cart c where c.number = '${req.body.number}';`
    var query1 = `select count(id) as counter from cart where number = '${req.body.number}';`
    var query2 = `select sum(c.price) as total_ammount from cart c where c.quantity <= (select p.quantity from products p where p.id = c.booking_id ) and  c.number = '${req.body.number}' ;`
    var query3 = `select c.*,(select s.name from products s where s.id = c.booking_id) as servicename
    ,(select s.image from products s where s.id = c.booking_id) as productlogo,
    (select s.quantity from products s where s.id = c.booking_id) as productquantity,
    (select s.small_description from products s where s.id = c.booking_id) as productsmalldescription

      
    from cart c where c.quantity <= (select p.quantity from products p where p.id = c.booking_id ) and c.number = '${req.body.number}' ;`
    var query4 = `select count(id) as counter from cart c where c.quantity <= (select p.quantity from products p where p.id = c.booking_id ) and c.number = '${req.body.number}';`
    var query5 = `select id , upi_id , qr_image , account_holder_name , ifsc_code , branch_name , bank_name , account_number , account_type from vendor where id = '${req.query.vendorid}';`
    pool.query(query+query1+query2+query3+query4+query5, (err, result) => {
      if (err) throw err;
      else if (result[0][0]) {
        req.body.mobilecounter = result[1][0].counter;
        console.log("MobileCounter", req.body.mobilecounter);
        res.json(result);
      } else
        res.json({
          msg: "empty cart",
        });
    });

});



let data2 = []



router.get('/index',(req,res)=>{
 let data1 = []
pool.query(`select * from app_order`,(err,result)=>{
        if(err) throw err;
        else {
    //  console.log(result.length)
    
   for( i=0;i<result.length;i++){
       let j = i
       let length = result.length
       let title = result[i].title
       let categoryid = result[i].categoryid
       let subcategoryid = result[i].subcategoryid

// console.log('original',j)

       
       pool.query(`select * from products where categoryid = '${categoryid}' and subcategoryid = '${subcategoryid}'`,(err,response)=>{
           if(err) throw err;
           else {
  


// console.log(j)
   data2.push({Title:title,data:response})
 
    // console.log('dfgfdfffff',data2)
    // res.json(data2)



           
           }

        //    console.log('fgy',response[0])
           


       })
     
   }
//    console.log('finaltime',data2)
   res.json(data2)
   data2 = []

        }
    })

})



function check_repurchse(number,dp){

  pool.query(`select * from member where number = '${number}'`,(err,result)=>{
    if(err) throw err;
    else if(result[0]){
   
      let bv = (dp*20)/100;
      pool.query(`update member set bv = bv+${bv} where number = '${number}'`,(err,result)=>{
        if(err) throw err;
        else {
          res.json({
            msg : 'success'
        })
        }
      })


    }
    else{
      res.json({
        msg : 'success'
    })
    }
  })

}



router.post('/buy-now',(req,res)=>{
    let body = req.body;



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
   body['orderid'] = result;


    pool.query(`insert into booking set ?`, body,(err,result)=>{
        if(err) throw err;
        else {
     pool.query(`update products set quantity = quantity - ${req.body.quantity} where id = ${req.body.booking_id}`,(err,result)=>{
         if(err) throw err;
         else {
            check_repurchse(req.body.number)
         }
     })

        }
    })
})



router.post('/order-now',(req,res)=>{
  let body = req.body;
console.log('body',req.body)
  let cartData = req.body


//  console.log('CardData',cartData)

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


 


 pool.query(`select * from cart where number = '${req.body.usernumber}'`,(err,result)=>{
     if(err) throw err;
     else {

     let data = result

     for(i=0;i<result.length;i++){
      data[i].name = req.body.name
      data[i].date = today
      data[i].orderid = orderid
      data[i].status = 'pending'
      data[i].number = req.body.number
      data[i].usernumber = req.body.usernumber
      data[i].payment_mode = 'cash'
      data[i].address = req.body.address
      data[i].id = null


     }




for(i=0;i<data.length;i++) {
 let j = i;
 pool.query(`insert into booking set ?`,data[i],(err,result)=>{
         if(err) throw err;
         else if(result){

// console.log('afyeri',j);


pool.query(`update products set quantity = quantity - ${data[j].quantity} where id = '${data[j].booking_id}'`,(err,result)=>{
 if(err) throw err;
 else {
console.log(data[j].quantity);
 }

})

         }
    })
}


  


pool.query(`delete from cart where number = '${req.body.usernumber}'`,(err,result)=>{
  if(err) throw err;
  else {

    res.json({
      msg : 'success'
  })

  }
})


     }
 })

 
})



router.get('/view-all-product',(req,res)=>{
    console.log('que',req.query)
    var query = `select t.* ,   
      (select p.name from product p where p.id = t.productid) as productname,
      (select p.price from product p where p.id = t.productid) as productprice,
      (select p.quantity from product p where p.id = t.productid) as productquantity,
      (select p.discount from product p where p.id = t.productid) as productdiscount,
      (select p.image from product p where p.id = t.productid) as productimage,
      (select p.categoryid from product p where p.id = t.productid) as productcategoryid,
      (select p.subcategoryid from product p where p.id = t.productid) as productsubcategoryid,
      (select p.net_amount from product p where p.id = t.productid) as productnetamount ,
    (select c.quantity from cart c where c.booking_id = t.productid and c.usernumber = '${req.query.number}'  ) as userquantity
  
      from banner_manage t where t.bannerid = '${req.query.id}' `
      pool.query(query,(err,result)=>{
        if(err) throw err;
       else res.json(result)
      })
  })
  
  
  
  router.get('/view-all-text-product',(req,res)=>{
    console.log('que',req.query)
    var query = `select t.* ,   
      (select p.name from product p where p.id = t.productid) as productname,
      (select p.price from product p where p.id = t.productid) as productprice,
      (select p.quantity from product p where p.id = t.productid) as productquantity,
      (select p.discount from product p where p.id = t.productid) as productdiscount,
      (select p.image from product p where p.id = t.productid) as productimage,
      (select p.categoryid from product p where p.id = t.productid) as productcategoryid,
      (select p.subcategoryid from product p where p.id = t.productid) as productsubcategoryid,
      (select p.net_amount from product p where p.id = t.productid) as productnetamount ,
    (select c.quantity from cart c where c.booking_id = t.productid and c.usernumber = '${req.query.number}'  ) as userquantity
  
      from promotional_text_management t where t.bannerid = '${req.query.id}' `
      pool.query(query,(err,result)=>{
        if(err) throw err;
       else res.json(result)
      })
  })
  
  
  
  
  router.get('/show-all-promotional-text',(req,res)=>{
    pool.query(`select * from promotional_text order by id desc`,(err,result)=>{
      if(err) throw err;
      else res.json(result)
    })
  })
  
  
  
  
  
  router.get('/promotional/text/delete', (req, res) => {
    let body = req.body
    pool.query(`delete from promotional_text where id = ${req.query.id}`, (err, result) => {
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
  
  
  router.post('/promotional/text/update', (req, res) => {
    pool.query(`update promotional_text set ? where id = ?`, [req.body, req.body.id], (err, result) => {
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
  
  
  
  
  router.post('/promotional/text/update_image',upload.single('image'), (req, res) => {
    let body = req.body;
    body['image'] = req.file.filename
  
  
  pool.query(`update promotional_text set ? where id = ?`, [req.body, req.body.id], (err, result) => {
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
  
            res.redirect('/banner/new-promotional-text')
        }
    })
  
  
  
  
   
  })
  
  
  
  router.get('/get-faq',(req,res)=>{
    pool.query(`select * from faq order by id desc`,(err,result)=>{
      if(err) throw err;
      else res.json(result)
    })
  })
  
  
  router.get('/get-faq/delete',(req,res)=>{
    pool.query(`delete from faq where id = '${req.query.id}'`,(err,result)=>{
      if(err) throw err;
      else res.json(result)
    })
  })
  
  
  
  router.post('/update-faq', (req, res) => {
    pool.query(`update faq set ? where id = ?`, [req.body, req.body.id], (err, result) => {
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
  
    
  
  router.get('/all-website-customize',(req,res)=>{
    pool.query(`select * from website_customize`,(err,result)=>{
      if(err) throw err;
      else res.json(result)
    })
  })
  
  
  
  
  router.get('/get-faq/website',(req,res)=>{
    pool.query(`delete from website_customize where id = '${req.query.id}'`,(err,result)=>{
      if(err) throw err;
      else res.json(result)
    })
  })
  
  
  
  
  router.post('/update-website', (req, res) => {
    pool.query(`update website_customize set ? where id = ?`, [req.body, req.body.id], (err, result) => {
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
  
  
  
   
  router.post("/payment-initiate", (req, res) => {
  const url = `https://rzp_live_2AYlv8GRAaT63p:iIzpixX7YsDSUVPtAtbO5SMn@api.razorpay.com/v1/orders/`;

  const data = {
    // amount: req.body.amount* 100, // amount in the smallest currency unit
    amount:100,
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
  })



  router.get("/demo", (req, res) => {
    res.render("dem");
  });

  
  router.get("/demo1", (req, res) => {
    console.log(req.query);
    res.send(req.query);
  });

  
  router.post("/razorpay-response", (req, res) => {
    let body = req.body;
    console.log("response recieve", body);
  
    if (body.razorpay_signature) {
      res.redirect("/api/success_razorpay");
    } else {
      res.redirect("/api/failed_payment");
    }
  });

  
  router.get("/success_razorpay", (req, res) => {
    res.json({
      msg: "success",
    });
  });

  
  router.get("/failed_payment", (req, res) => {
    res.json({
      msg: "failed",
    });
  });
  
 
  router.post("/failed_payment", (req, res) => {
    res.json({
      msg: "failed",
    });
  });
  
  

  router.get('/get-top-banner',(req,res)=>{
    pool.query(`select * from banner where type = 'Front Banner'`,(err,result)=>{
      if(err) throw err;
      else res.json(result)
    })
  })
  
  
  
  router.get('/get-bottom-banner',(req,res)=>{
    pool.query(`select * from banner where type = 'Bottom Banner'`,(err,result)=>{
      if(err) throw err;
      else res.json(result)
    })
  })
  



 


router.post('/check1',(req,res)=>{
  console.log('number',req.body.number)
  pool.query(`select v.* , (select c.category_type from category c where c.id = v.categoryid) as categorytype from vendor v where v.number = '${req.body.number}'`,(err,result)=>{
    if(err) throw err;
    else if(result[0]){

    
     if(result[0].status == 'approved'){
      console.log('result approved',result)
      res.json({
        msg : 'success',
        result:result
      })
 }
 else if(result[0].status != 'approved'){
  console.log('result pending',result)

   res.json({
     msg : 'pending',
     
   })
}
    }
 
    else{
      res.json({
      msg : 'user not found'
    })
   }


  })
})




router.post('/check',(req,res)=>{
  console.log('number',req.body.number)
  pool.query(`select v.* , (select c.category_type from category c where c.id = v.categoryid) as categorytype from vendor v where v.number = '${req.body.number}'`,(err,result)=>{
    if(err) throw err;
    else if(result[0]){

    
     if(result[0].status == 'approved'){
      console.log('result approved',result)
      res.json({
        msg : 'success',
        result:result
      })
 }
 else if(result[0].status != 'approved'){
  console.log('result pending',result)

  res.json({
    msg : 'pending',
    result:result
  })
 
  
}
    }
 
    else{


      pool.query(`select * from channel_partner where number = '${req.body.number}'`,(err,result)=>{
        if(err) throw err;
        else if(result[0]){
          res.json({
            msg : 'success',
            result:result
          })
        }
        else{
    pool.query(`select * from agent where number = '${req.body.number}'`,(err,result)=>{
      if(err) throw err;
      else if(result[0]){
        res.json({
          msg : 'success',
          result:result
        })
      }
      else{
      res.json({
      msg : 'user not found'
    })
      }
    })
        }
      })
    


    
   }


  })
})





router.post('/all-orders',(req,res)=>{
  pool.query(`select * from booking where vendorid = '${req.body.vendorid}' and status = 'pending' order by id desc;`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})



router.post('/ongoing-orders',(req,res)=>{
  pool.query(`select b.* , (select p.name from products p where p.id = b.booking_id ) as bookingname from booking b where b.vendorid = '${req.body.vendorid}' and b.status != 'completed'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})


router.post('/completed-orders',(req,res)=>{
  pool.query(`select b.* , (select p.name from products p where p.id = b.booking_id ) as bookingname from booking b where b.vendorid = '${req.body.vendorid}' and b.status = 'completed'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})



router.post('/update-status',(req,res)=>{
  pool.query(`update booking set ? where id = ?`, [req.body, req.body.id], (err, result) => {
    if(err) throw err;
    else {
      res.json({
        status:200,
        msg : 'success',
        description:'successfully added'
    })
    }
  })
})



router.post('/overview',(req,res)=>{
  var query = `select count(id) as counter from booking where status = 'pending' and vendorid = '${req.body.vendorid}';`
  var query1 = `select count(id) as counter from booking where status = 'Order Accepted' and vendorid = '${req.body.vendorid}';`
  var query2 = `select count(id) as counter from booking where status = 'Processing' and vendorid = '${req.body.vendorid}';`
  var query3 = `select count(id) as counter from booking where status = 'Ready For Delivery' and vendorid = '${req.body.vendorid}';`
  var query4 = `select count(id) as counter from booking where status = 'On The Way' and vendorid = '${req.body.vendorid}';`
  var query5 = `select count(id) as counter from booking where status = 'Delivered' and vendorid = '${req.body.vendorid}';`
  var query6 = `select count(id) as counter from booking where status = 'Cancel' and vendorid = '${req.body.vendorid}';`
  pool.query(query+query1+query2+query3+query4+query5+query6,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})


router.post('/show-vendor-orders',(req,res)=>{
  pool.query(`select * from booking where vendorid = '${req.body.vendorid}' and status = '${req.body.status}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})



router.get('/profile',(req,res)=>{
  pool.query(`select v.*, (select c.name from category c where c.id = v.categoryid) as categoryname from vendor v where id = '${req.query.id}'`,(err,result)=>{
    if(err) throw err;
    else {
      console.log(result)
      res.json(result)
    };
  })
})



router.post('/update-profile', (req, res) => {
  let body = req.body

  pool.query(`update vendor set ? where id = ?`, [req.body, req.body.vendorid], (err, result) => {
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


router.get('/my-earning',(req,res)=>{
  var query = `select count(id) as counter from booking where vendorid = '${req.query.vendorid}';`
  var query1 = `select sum(price) as total_amount from booking where vendorid = '${req.query.vendorid}';`
  pool.query(query+query1,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })

})





// driver api



router.post('/driver/insert',upload.single('image'),(req,res)=>{
  let body = req.body
  body['image'] = req.file.filename;
  body['status'] = 'Pending'
  pool.query(`insert into driver set ?`,body,(err,result)=>{
      if(err) throw err;
      else res.json(result)
  })
})




router.post('/driver/check',(req,res)=>{
  pool.query(`select * from driver where number = '${req.body.number}'`,(err,result)=>{
    if(err) throw err;
    else if(result[0].status == 'approved'){
         res.json({
           msg : 'success',
           result:result
         })
    }
    else if(result[0].status != 'approved'){
      res.json({
        msg : 'pending',
        
      })
 }
    else {
      res.json({
        msg : 'user not found'
      })
    }
  })
})






router.post('/driver/all-orders',(req,res)=>{
  pool.query(`select * from booking where driverid = '${req.body.vendorid}' and status1 = 'pending' order by id desc;`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})



router.post('/driver/ongoing-orders',(req,res)=>{
  pool.query(`select * from booking where driverid = '${req.body.vendorid}' and status1 != 'completed'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})


router.post('/driver/completed-orders',(req,res)=>{
  pool.query(`select * from booking where driverid = '${req.body.vendorid}' and status1 = 'completed'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})



router.post('/driver/update-status',(req,res)=>{
  pool.query(`update booking set ? where id = ?`, [req.body, req.body.id], (err, result) => {
    if(err) throw err;
    else {
      res.json({
        status:200,
        msg : 'success',
        description:'successfully added'
    })
    }
  })
})



router.post('/driver/overview',(req,res)=>{
  var query = `select count(id) as counter from booking where status1 = 'pending' and driverid = '${req.body.vendorid}';`
  var query1 = `select count(id) as counter from booking where status1 = 'Order Accepted' and driverid = '${req.body.vendorid}';`
  var query2 = `select count(id) as counter from booking where status1 = 'Processing' and driverid = '${req.body.vendorid}';`
  var query3 = `select count(id) as counter from booking where status1 = 'Ready For Delivery' and driverid = '${req.body.vendorid}';`
  var query4 = `select count(id) as counter from booking where status1 = 'On The Way' and driverid = '${req.body.vendorid}';`
  var query5 = `select count(id) as counter from booking where status1 = 'Delivered' and driverid = '${req.body.vendorid}';`
  var query6 = `select count(id) as counter from booking where status1 = 'Cancel' and driverid = '${req.body.vendorid}';`
  pool.query(query+query1+query2+query3+query4+query5+query6,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})


router.post('/driver/show-vendor-orders',(req,res)=>{
  pool.query(`select * from booking where driverid = '${req.body.vendorid}' and status1 = '${req.body.status}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})



router.get('/driver/profile',(req,res)=>{
  pool.query(`select * from driver where id = '${req.query.id}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result);
  })
})



router.post('/driver/update-profile', (req, res) => {
  let body = req.body
  pool.query(`update driver set ? where id = ?`, [req.body, req.body.vendorid], (err, result) => {
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


router.get('/driver/my-earning',(req,res)=>{
  var query = `select count(id) as counter from booking where driverid = '${req.query.vendorid}';`
  var query1 = `select sum(price) as total_amount from booking where driverid = '${req.query.vendorid}';`
  pool.query(query+query1,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })

})



router.get('/get-coupon',(req,res)=>{
  pool.query(`select * from coupon where vendorid = '${req.query.vendorid}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})


router.get('/get-all-vendor',(req,res)=>{
  pool.query(`select * from vendor where status = 'approved' order by name`,(err,result)=>{
    err ? console.log(err) : res.json(result)
  })
})


// router.post('/save-merchant',upload.fields([{ name: 'personal_kyc_img', maxCount: 1 }, { name: 'business_kyc_img', maxCount: 1 } , { name: 'image', maxCount: 1 } , { name: 'shop_img2', maxCount: 1 } , { name: 'transaction_image', maxCount: 1 } ]),(req,res)=>{
//   let body = req.body;
// console.log(req.body)
// console.log('before image',req.files)

// // if(req.body.transaction_image[0]){
// //   body['transaction_image'] = '';
// // }
// // else{
// // }


   


//   body['personal_kyc_img'] = req.files.personal_kyc_img[0].filename;

//   body['business_kyc_img'] = req.files.business_kyc_img[0].filename;

//   body['image'] = req.files.image[0].filename;
//   body['shop_img2'] = req.files.shop_img2[0].filename;
//   body['status'] = 'pending';

//   console.log('after image',req.body)


//  var today = new Date();
// var dd = today.getDate();

// var mm = today.getMonth()+1; 
// var yyyy = today.getFullYear();
// if(dd<10) 
// {
//     dd='0'+dd;
// } 

// if(mm<10) 
// {
//     mm='0'+mm;
// } 
// today = yyyy+'-'+mm+'-'+dd;


// body['date'] = today

//   console.log(req.body);
//   body['userid'] = 'TT'
//   pool.query(`insert into vendor set ?`,body,(err,result)=>{
//     if(err) throw err;
//     else res.json({msg:'success'})
//   })
// })


router.post('/save-merchant',upload.fields([{ name: 'personal_kyc_img', maxCount: 1 }, { name: 'aadhar_back', maxCount: 1 }   ,  { name: 'transaction_image', maxCount: 1 }   ]),(req,res)=>{
  let body = req.body;


  body['personal_kyc_img'] = req.files.personal_kyc_img[0].filename;
 
  body['status'] = 'pending';
  body['cp_payment_status'] = 'pending';


if(req.files.transaction_image){
  body['transaction_image'] = req.files.transaction_image[0].filename;

}
else {
  body['transaction_image'] = ''
}




if(req.files.aadhar_back){
  body['aadhar_back'] = req.files.aadhar_back[0].filename;

}
else {
  body['aadhar_back'] = ''
}
  

var today = new Date();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = yyyy + '-' + mm + '-' + dd;


  body['date'] = today;
  body['time'] = time;
  body['viewers'] = 0;




  console.log(req.body);
 
  var otp = Math.floor(1000 + Math.random() * 9000);
  body['userid'] = 'DLSJ' + otp;


  pool.query(`select channel_partner_id from agent where userid = '${req.body.agentid}'`,(err,result)=>{
    if(err) throw err;
    else {
      console.log(result[0])

      body['channel_partner_id'] = result[0].channel_partner_id;
      console.log(req.body)
      pool.query(`insert into vendor set ?`,body,(err,result)=>{
        if(err) throw err;
        else res.json({msg:'success'})
      })
    }
  })
 



})


router.post('/update-merchant', (req, res) => {
  let body = req.body
  console.log(req.body)
  pool.query(`update vendor set ? where number = ?`, [req.body, req.body.number], (err, result) => {
      if(err) {
        console.log('err',err);
          res.json({
              status:500,
              type : 'error',
              description:err
          })
      }
      else {
        console.log('result',result)
          res.json({
              status:200,
              type : 'success',
              description:'successfully update'
          })

          
      }
  })
})



router.post('/check-bde-code',(req,res)=>{
  pool.query(`select * from agent where userid = '${req.body.agent_id}'`,(err,result)=>{
    if(err) throw err;
    else if(result[0]){
      res.json({msg:'success'})
    }
    else{
      res.json({msg:'invalid'})
    }
  })
})



router.post('/check-vendor-number',(req,res)=>{
  console.log(req.body)
  pool.query(`select * from vendor where number = '${req.body.number}'`,(err,result)=>{
    if(err) throw err;
    else if(result[0]){
      res.json({msg:'success'})
    }
    else{
      res.json({msg:'invalid'})
    }
  })
})








router.get('/get-details-dynamic',(req,res)=>{
  pool.query(`select * from details order by id desc`,(err,result)=>{
    if(err) throw err;
    else res.json(result);
  })
})


router.post('/get-vendor-product',(req,res)=>{
  pool.query(`select * from products where vendorid = '${req.body.vendorid}'`,(err,result)=>{
    err ? console.log(err) : res.json(result)
  })
})





router.get('/deals',(req,res)=>{
  
    var query7 = `select c.* ,
    (select r.id from redeem_code r where r.coupounid = c.id and r.usernumber = '${req.query.usernumber}' and r.vendorid = c.vendorid) as isredeem ,
    (select r.otp from redeem_code r where r.coupounid = c.id and r.usernumber = '${req.query.usernumber}' and r.vendorid = c.vendorid) as userotp 
    from deals c where c.deals_type = 'Exclusive Deals' and c.vendorid = '${req.query.vendorid}';`
    var query8 = `select c.*,
    (select r.id from redeem_code r where r.coupounid = c.id and r.usernumber = '${req.query.usernumber}' and r.vendorid = c.vendorid) as isredeem ,
    (select r.otp from redeem_code r where r.coupounid = c.id and r.usernumber = '${req.query.usernumber}' and r.vendorid = c.vendorid) as userotp 
    from deals c where c.deals_type = 'Deals Of the Day' and c.vendorid = '${req.query.vendorid}';`
    var query9 = `select c.*,
    (select r.id from redeem_code r where r.coupounid = c.id and r.usernumber = '${req.query.usernumber}' and r.vendorid = c.vendorid) as isredeem ,
    (select r.otp from redeem_code r where r.coupounid = c.id and r.usernumber = '${req.query.usernumber}' and r.vendorid = c.vendorid) as userotp 
    from deals c where c.deals_type = 'Mega Deals' and c.vendorid = '${req.query.vendorid}';`

    pool.query(query7+query8+query9,(err,result)=>{
      if(err) throw err;
      else res.json(result)
    })
})



router.get('/vendor-coupon',(req,res)=>{
  var query = `select * from coupon where vendorid = '${req.query.vendorid}';`
  pool.query(query,(err,result)=>{
    if(err) throw err;
    else res.json(result);
  })

})




router.post('/get-products-api',(req,res)=>{
  pool.query(`select * from products where vendorid = '${req.body.vendorid}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})



router.get('/get-exclusive-deals',(req,res)=>{
  pool.query(`select c.* ,
  (select r.id from redeem_code r where r.coupounid = c.id and r.usernumber = '${req.query.number}' and r.vendorid = c.vendorid) as isredeem ,
  (select r.otp from redeem_code r where r.coupounid = c.id and r.usernumber = '${req.query.number}' and r.vendorid = c.vendorid) as userotp 
  from deals c where c.deals_type = 'Exclusive Deals'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})



router.get('/get-deals-of-the-day',(req,res)=>{
  pool.query(`select c.* ,
  (select r.id from redeem_code r where r.coupounid = c.id and r.usernumber = '${req.query.number}' and r.vendorid = c.vendorid) as isredeem ,
  (select r.otp from redeem_code r where r.coupounid = c.id and r.usernumber = '${req.query.number}' and r.vendorid = c.vendorid) as userotp 
  from deals c where c.deals_type = 'Deals Of the Day'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})


router.get('/get-mega-deals',(req,res)=>{
  pool.query(`select c.* ,
  (select r.id from redeem_code r where r.coupounid = c.id and r.usernumber = '${req.query.number}' and r.vendorid = c.vendorid) as isredeem ,
  (select r.otp from redeem_code r where r.coupounid = c.id and r.usernumber = '${req.query.number}' and r.vendorid = c.vendorid) as userotp 
  from deals c where c.deals_type = 'Mega Deals'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})



router.post('/redeem-this-code',(req,res)=>{
  let body = req.body;
  body['otp'] = Math.floor(100000 + Math.random() * 9000);
  body['status'] = 'pending'
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = mm + '/' + dd + '/' + yyyy;
  body['date'] = today
 pool.query(`insert into redeem_code set ?`,body,(err,result)=>{
    if(err) throw err;
    else res.json({msg:'success'})
  })
})



router.get('/my-deals',(req,res)=>{
  pool.query(`select r.* , 
  (select v.business_name from vendor v where v.id = r.vendorid) as vendorbusinessname,
  (select c.short_description from coupon c where c.id = r.coupounid ) as coupon_description,
  (select c.maximum_cashback_price from coupon c where c.id = r.coupounid ) as coupon_cashprice

  from redeem_code r where usernumber = '${req.query.number}' order by id desc limit 30;`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})






router.post('/remove-all-data-by-id',(req,res)=>{
  pool.query(`delete from cart where usernumber = '${req.body.number}' and id ='${req.body.id}'`,(err,result)=>{
      if(err) throw err;
      else {
          res.json({
              msg : 'success'
          })
      }
  })
})


router.post('/remove-all-data',(req,res)=>{
  pool.query(`delete from cart where usernumber = '${req.body.number}'`,(err,result)=>{
      if(err) throw err;
      else {
          res.json({
              msg : 'success'
          })
      }
  })
})






router.get('/delete-address',(req,res)=>{
  pool.query(`delete from address where id = '${req.query.id}'`,(err,result)=>{
    if(err) throw err;
    else res.json({msg:'success'})
  })
})



router.get('/get-single-address',(req,res)=>{
  pool.query(`select * from address where id = '${req.query.id}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})




router.post('/update-address', (req, res) => {
  console.log('data',req.body)
  pool.query(`update address set ? where id = ?`, [req.body, req.body.id], (err, result) => {
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




router.get('/get-single-deals',(req,res)=>{
  pool.query(`select c.* ,
  (select r.id from redeem_code r where r.coupounid = c.id and r.usernumber = '${req.query.number}' and r.vendorid = c.vendorid) as isredeem ,
  (select r.otp from redeem_code r where r.coupounid = c.id and r.usernumber = '${req.query.number}' and r.vendorid = c.vendorid) as userotp 
  from deals c where c.id = '${req.query.id}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result);
  })
})


router.get('/get-single-coupon',(req,res)=>{
  pool.query(`select c.* ,
  (select r.id from redeem_code r where r.coupounid = c.id and r.usernumber = '${req.query.number}' and r.vendorid = c.vendorid) as isredeem ,
  (select r.otp from redeem_code r where r.coupounid = c.id and r.usernumber = '${req.query.number}' and r.vendorid = c.vendorid) as userotp 
  from coupon c where c.id = '${req.query.id}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result);
  })
})



router.get('/get-single-order',(req,res)=>{
  pool.query(`select b.* ,
   (select p.name from products p where p.id = b.booking_id) as product_name,
   (select p.image from products p where p.id = b.booking_id) as product_image
  from booking b where id = '${req.query.id}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result);
  })
})



router.post('/get-coupons',(req,res)=>{
  pool.query(`select * from coupon where vendorid = '${req.body.vendorid}' order by id desc limit 20;`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})


router.post('/get-deals',(req,res)=>{
  pool.query(`select * from deals where vendorid = '${req.body.vendorid}' order by id desc limit 20;`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})




router.post('/vendor-dashboard',(req,res)=>{
      var query =  `select count(id) as today_order from booking where vendorid = '${req.body.vendorid}' and date = 'CURDATE()';`
      var query1 = `select sum(price) as today_revenue from booking where vendorid = '${req.body.vendorid}';`
      var query2 = `select count(id) as total_order from booking where vendorid = '${req.body.vendorid}';`
      var query3 = `select sum(price) as total_revenue from booking where vendorid = '${req.body.vendorid}';`
      var query4 = `select count(id) as total_viewers from viewers where vendorid = '${req.body.vendorid}';`
      var query5 = `select viewers,id  from vendor where id = '${req.body.vendorid}';`
      var query6 = `select count(id) as today_viewers from viewers where vendorid = '${req.body.vendorid}' and date = 'CURDATE()';`

    
      pool.query(query+query1+query2+query3+query4+query5+query6,(err,result)=>{
          if(err) throw err;
          else res.json(result);
      })
})





router.post('/merchant/update-image',upload.fields([{ name: 'qr_image', maxCount: 1 }]), (req, res) => {
  let body = req.body;
  body['qr_image'] = req.files.qr_image[0].filename;

  // pool.query(`select image from ${table} where id = '${req.body.id}'`,(err,result)=>{
  //     if(err) throw err;
  //     else {
  //         fs.unlinkSync(`public/images/${result[0].image}`); 


pool.query(`update vendor set ? where number = ?`, [req.body, req.body.number], (err, result) => {
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


router.get('/check-update',(req,res)=>{
  if(req.query.version == 3){
    res.json({msg:'updated'})

  }
  else{
    res.json({msg:'not updated'})
  }
})

// router.get('/get-profile')






// portfolio api


router.post('/add-portfolio',upload.single('image'), (req, res) => {
  let body = req.body;
  body['image'] = req.file.filename;
  var today = new Date();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  
  today = yyyy + '-' + mm + '-' + dd;
  
  
    body['date'] = today;
    body['time'] = time;

  console.log(req.body);

  // pool.query(`select image from ${table} where id = '${req.body.id}'`,(err,result)=>{
  //     if(err) throw err;
  //     else {
  //         fs.unlinkSync(`public/images/${result[0].image}`); 


pool.query(`insert into portfolio set ?`,body, (err, result) => {
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



router.get('/get-my-portfolio',(req,res)=>{
  pool.query(`select * from portfolio where vendorid = '${req.query.vendorid}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result);
  })
})




router.post('/update-profile-image',upload.single('image'), (req, res) => {
  let body = req.body;
  body['image'] = req.file.filename
console.log(req.body)

pool.query(`update vendor set ? where number = ?`, [req.body, req.body.number], (err, result) => {
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



router.post('/update-profile-video',upload.single('video'), (req, res) => {
  let body = req.body;
  console.log('data recieved before',req.body)
  console.log('file recieved',req.file)


  body['video'] = req.file.filename
  console.log('data recieved after',req.body)

pool.query(`update vendor set ? where number = ?`, [req.body, req.body.number], (err, result) => {
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



router.post('/agent-dashboard',(req,res)=>{
  console.log('body',req.body)
  var query = `select count(id) as today_vendor from vendor where agentid = '${req.body.agentid}' and date = CURDATE();`
  var query1 = `select count(id) as total_vendor from vendor where agentid = '${req.body.agentid}';`

  pool.query(query+query1,(err,result)=>{
      if(err) throw err;
else res.json(result);
  })
})




router.post('/channel-partner-dashboard',(req,res)=>{
  console.log('body h',req.body)
  var query = `select count(id) as total_agent from agent where channel_partner_id = '${req.body.id}';`
  var query1 = `select count(id) as total_merchant from vendor where channel_partner_id = '${req.body.id}';`
  var query2 = `select count(id) as today_merchant from vendor where channel_partner_id = '${req.body.id}' and date = CURDATE();`
  var query3 = `select sum(price) as payment_pending from vendor where channel_partner_id = '${req.body.id}' and cp_payment_status = 'pending';`
  var query4 = `select sum(price) as payment_recieved from vendor where channel_partner_id = '${req.body.id}' and cp_payment_status = 'success';`


  pool.query(query+query1+query2+query3+query4,(err,result)=>{
      // res.render('Admin/Dashboard',{msg : '',result})
      if(err) throw err;
else res.json(result);
  })
})


//


router.post('/cp_history',(req,res)=>{
  pool.query(`select * from cp_transaction where cp_id = '${req.body.id}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})







router.post('/add-menu',upload.single('image'),(req,res)=>{
  let body = req.body;

  console.log(req.files)
  body['image'] = req.file.filename
  var today = new Date();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  
  today = yyyy + '-' + mm + '-' + dd;
  
  
    body['date'] = today;
    body['time'] = time;

console.log(req.body)
 pool.query(`insert into menu set ?`,body,(err,result)=>{
     err ? console.log(err) : res.json({msg : 'success'})
 })
// }
// else {
//     body['image'] = req.files.image[0].filename;
//     // body['icon'] = req.files.icon[0].filename;
//  console.log(req.body)
//    pool.query(`insert into agent set ?`,body,(err,result)=>{
//        err ? console.log(err) : res.json({msg : 'success'})
//    })
// }

})



router.get('/get-menu',(req,res)=>{
  pool.query(`select * from menu where vendorid = '${req.query.id}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})



// router.get('/state')



router.post('/send-notification',async(req,res)=>{
  pool.query(`select token from vendor where token is not null`,(err,result)=>{
        if(err) throw err;
   
        else {
            for(i=0;i<result.length;i++) {
                console.log(result[i].token)
                const message = {
                    to: result[i].token,
                    sound: 'default',
                    title: 'Salary Salary Salary....',
                    body: '-',
                    data: { someData: 'goes here' },
                  };

                  //request.post('https://exp.host/--/api/v2/push/send').form({message})   
// request.post({url:'https://exp.host/--/api/v2/push/send',body: JSON.stringify(message)} , function(err,httpResponse,data){
//     console.log('sending data',body)
//     if(err) throw err;
//     else res.json(data)
//  })
                
                   fetch('https://exp.host/--/api/v2/push/send', {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Accept-encoding': 'gzip, deflate',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(message),
                  });
                

            }
            res.json({
                msg : 'success'
            })
        }
    })
})




router.get('/get-terms-and-conditions',(req,res)=>{
  
  pool.query(`select * from website_customize where name = 'tc'`,(err,result)=>{
    if(err) throw err;
    else {
   res.json(result)
    }
  })
})





router.get('/get-all-event',(req,res)=>{
  pool.query(`select id,image from event`,(err,result)=>{
    if(err) throw err;
    else res.json(result);
  })
})


router.get('/get-single-event',(req,res)=>{
  pool.query(`select * from event where id = '${req.query.id}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result);
  })
})


router.post('/apply_event',(req,res)=>{
  let body = req.body;
  var today = new Date();

var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = yyyy + '-' + mm + '-' + dd;


  body['date'] = today;
  body['time'] = time;


  pool.query(`insert into apply_event set ?`,body,(err,result)=>{
    if(err) throw err;
    else res.json(result);
  })
})



router.post('/merchant_apply_event',(req,res)=>{
  let body = req.body;
  var today = new Date();

  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = yyyy + '-' + mm + '-' + dd;


  body['date'] = today;
  body['time'] = time;


  pool.query(`insert into merchant_apply_event set ?`,body,(err,result)=>{
    if(err) throw err;
    else res.json(result);
  })
})




router.get('/get-customer-order',(req,res)=>{
  pool.query(`select * from booking where vendorid = '${req.query.vendorid}' and number = '${req.query.number}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})


router.get('/get-rating',(req,res)=>{
  var query = `select r.* , (select u.name from users u where u.number = r.usernumber) as username from rating r where r.vendorid = '${req.query.vendorid}';`
  var query1 = `select avg(rating) as average_rating from rating where vendorid = '${req.query.vendorid}';`
  var query2 = `select count(id) as total_rating from rating where vendorid = '${req.query.vendorid}';`
  var query3 = `select count(id) as one_start_rating from rating where vendorid = '${req.query.vendorid}' and rating = '1';`
  var query4 = `select count(id) as two_start_rating from rating where vendorid = '${req.query.vendorid}' and rating = '2';`
  var query5 = `select count(id) as three_start_rating from rating where vendorid = '${req.query.vendorid}' and rating = '3';`
  var query6 = `select count(id) as four_start_rating from rating where vendorid = '${req.query.vendorid}' and rating = '4';`
  var query7 = `select count(id) as five_start_rating from rating where vendorid = '${req.query.vendorid}' and rating = '5';`



  pool.query(query+query1+query2+query3+query4+query5+query6+query7,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})








router.get('/single-vendor-details',(req,res)=>{

  var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = yyyy + '-' + mm + '-' + dd;


  var query = `select v.description , v.business_name , v.image , v.number , v.address , v.shop_online , v.owner_name_hide , v.name , v.id , (select c.name from category c where c.id = v.categoryid) as categoryname from vendor v where v.id = '${req.query.vendorid}';`
  var query1 = `select * from portfolio where vendorid = '${req.query.vendorid}' order by id desc;`
  var query2 = `select avg(rating) as average_rating from rating where vendorid = '${req.query.vendorid}';`
 
  pool.query(`update vendor set viewers = viewers + 1 where id = '${req.query.vendorid}'`,(err,result)=>{
 if(err) throw err;
    else {
      pool.query(`insert into viewers(vendorid,date,viewers) values('${req.query.vendorid}' , '${today}' , '1')`,(err,result)=>{
        if(err) throw err;
        else{
          pool.query(query+query1+query2,(err,result)=>{
            if(err) throw err;
            else res.json(result);
          })
        }
      })
    }
  })
})





router.get('/search',(req,res)=>{
    
  var query2 = `SELECT *, SQRT(
    POW(69.1 * (latitude - '${req.query.latitude}'), 2) +
    POW(69.1 * (longitude - '${req.query.longitude}') * COS(latitude / 57.3), 2)) AS distance
    FROM vendor where business_name Like '%${req.query.search}%' and status= 'approved'  and image is not null and address is not null and address!= 'null,null,null,null,null-null' having  distance <= 600000000000000 ORDER BY distance;`
   pool.query(query2,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })

 
})



router.get('/delete-protfolio',(req,res)=>{
  pool.query(`delete from portfolio where id = '${req.query.id}'`,(err,result)=>{
    if(err) throw err;
    else res.json({msg:'success'})
  })
})



// concept change 

router.post('/save-merchant1',upload.single('transaction_image'),(req,res)=>{
  let body = req.body;

  body['status'] = 'pending';
  body['cp_payment_status'] = 'pending';


if(req.file){
  body['transaction_image'] = req.file.filename
}
else {
  body['transaction_image'] = ''
}



var today = new Date();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = yyyy + '-' + mm + '-' + dd;


  body['date'] = today;
  body['time'] = time;
  body['viewers'] = 0;




  console.log(req.body);
 
  var otp = Math.floor(1000 + Math.random() * 9000);
  body['userid'] = 'DLSJ' + otp;


  pool.query(`select channel_partner_id from agent where userid = '${req.body.agentid}'`,(err,result)=>{
    if(err) throw err;
    else {
      console.log(result[0])

      body['channel_partner_id'] = result[0].channel_partner_id;
      console.log(req.body)
      pool.query(`insert into vendor set ?`,body,(err,result)=>{
        if(err) throw err;
        else res.json({msg:'success'})
      })
    }
  })
 



})



router.get('/get-details',(req,res)=>{


  var today = new Date();
  var todaytime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  
  today = yyyy + '-' + mm + '-' + dd;


  var query = `select v.number,v.business_name,
  (select a.name from agent a where a.userid = v.agentid) as agentname,
  (select a.number from agent a where a.userid = v.agentid) as agentnumber,
  (select a.name from channel_partner a  where a.userid = v.channel_partner_id) as cp_name,
  (select a.number from channel_partner a  where a.userid = v.channel_partner_id) as cp_number

  from vendor v where v.number = '${req.query.number}';`
  pool.query(query,(err,result)=>{
      if(err) throw err;
      else {
        let agentname = result[0].agentname;
        let cpname = result[0].cpname;
        let agentnumber = result[0].agentnumber;
        let cp_number = result[0].cp_number;
        let business_name = result[0].business_name;
          let message = `Dear ${business_name} has been successfully added on your behalf on ${agentname} . - <DealsAaj>`
          let contentid = `1307165010197480063`

          let message1 = `Namashkar ${agentname}! Congratulations! ${business_name} has been added to your team. Teams DealsAaj. -<DealsAaj>`
          let message2 = `Namashkar ${cpname}! Congratulations! ${business_name} has been added to your team. Teams DealsAaj. -<DealsAaj>`
        
          let contentid1 = `1307165007996952994`


         request.get({url:`https://pgapi.vispl.in/fe/api/v1/send?username=aformotpg.trans&password=z3xZ7&unicode=false&from=DLSAAJ&to=${req.query.number}&dltContentId=${contentid}&text=${message}`} , function(err,data){
           if(err) throw err;
           else {
          pool.query(`insert into message_sent (number , message , date , time) values('${req.query.number}' , '${message}' , '${today}' , '${todaytime}')`,(err,result)=>{
            if(err) throw err;
            else {
           console.log('success')
            }
          })
           }
         }) 


         request.get({url:`https://pgapi.vispl.in/fe/api/v1/send?username=aformotpg.trans&password=z3xZ7&unicode=false&from=DLSAAJ&to=${agentnumber}&dltContentId=${contentid1}&text=${message1}`} , function(err,data){
           if(err) throw err;
           else {
          pool.query(`insert into message_sent (number , message , date , time) values('${agentnumber}' , '${message}' , '${today}' , '${todaytime}')`,(err,result)=>{
            if(err) throw err;
            else {
            console.log('success')  
            }
          })
           }
         }) 


         request.get({url:`https://pgapi.vispl.in/fe/api/v1/send?username=aformotpg.trans&password=z3xZ7&unicode=false&from=DLSAAJ&to=${cp_number}&dltContentId=${contentid1}&text=${message2}`} , function(err,data){
          if(err) throw err;
          else {
         pool.query(`insert into message_sent (number , message , date , time) values('${cp_number}' , '${message2}' , '${today}' , '${todaytime}')`,(err,result)=>{
           if(err) throw err;
           else {
             res.json({
               msg :'success'
             })
           }
         })
          }
        }) 
      }
  })
})



module.exports = router;
