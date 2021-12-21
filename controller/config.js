const mysql = require('mysql');

const config = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "aice",
    timezone:'UTC'
});

module.exports = {
    config
}
