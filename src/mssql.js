const sql = require("mssql");
const config = require('./config');

sql.connect(config, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to the database.')
    }

});

exports.module = sql;