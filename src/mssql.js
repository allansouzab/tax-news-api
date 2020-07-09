var sql = require("mssql");

var config = {
    "user": process.env.MSSQL_USER,
    "password": process.env.MSSQL_PASSWORD,
    "server": process.env.MSSQL_SERVER,
    "database": process.env.MSSQL_DATABASE,
    "port": Number(process.env.MSSQL_PORT),
    "dialect": "mssql",
    "dialectOptions": {
        "instanceName": "SQLEXPRESS"
    }
};

sql.connect(config, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to the database.')
    }

});

exports.module = sql;