const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: '',
    database: 'autok'
  });
  
  con.connect((err) => {
    if (err) {
      console.log('Nem sikerült kapcsolodni az adatbázishoz');
    } else {
      console.log("Sikeres volt az adatbázis kapcsolat");
    }
  });

  module.exports = con;
