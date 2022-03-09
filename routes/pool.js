 
var mysql = require('mysql')

const pool = mysql.createPool({
 
   host : '167.71.231.201',
    user: 'root',
    password : '123a@8Anmanraspaa123a@*Anmanraspaa',
    database: 'wequick',
    port:'3306',
    multipleStatements: true
  })




module.exports = pool;

