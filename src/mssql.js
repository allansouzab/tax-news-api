var sql = require("mssql");

// config for your database
var config = {
    "user": 'SA',
    "password": 'DockerSql2017!',
    "server": 'localhost',
    "database": 'TaxNews',
    "port": 11433,
    "dialect": "mssql",
    "dialectOptions": {
        "instanceName": "SQLEXPRESS"
    }
};

// connect to your database
sql.connect(config, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to the database.')
    }

});

exports.module = sql;