 
var mysql = require('mysql')

const pool = mysql.createPool({
 
   host : 'db-mysql-blr1-27224-do-user-11060553-0.b.db.ondigitalocean.com',
    user: 'doadmin',
    password : '123a@8Anmanraspaa123a@*Anmanraspaa',
    database: 'nR4wZPTOvPY3Mep8',
    port:'25060',
    multipleStatements: true
  })




module.exports = pool;

