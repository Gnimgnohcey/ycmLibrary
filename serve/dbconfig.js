var mysql = require('mysql')
// 链接数据库
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'bookadminsql',
  port: '3306'
})

module.exports = connection
