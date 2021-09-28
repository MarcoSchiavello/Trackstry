const mysql = require("mysql");

const conn = mysql.createConnection({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PWD,
    host: process.env.DB_HOST,
    database: process.env.DB
});

conn.connect(err =>{
    if(err)
        console.log("errore con la connesione al DB");
});

module.exports = {
    mysql: mysql,
    conn: conn,
};