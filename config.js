"use strict";

const assert = require("assert");
const dotenv = require("dotenv");

// read in the .env file
dotenv.config();

// capture the environment variables the application needs
const {
    SQL_PORT,
    SQL_SERVER,
    SQL_DATABASE,
    SQL_USER,
    SQL_PASSWORD
} = process.env;

// validate the required configuration information
assert(SQL_PORT, "SQL_PORT configuration is required.");
assert(SQL_SERVER, "SQL_SERVER configuration is required.");
assert(SQL_DATABASE, "SQL_DATABASE configuration is required.");
assert(SQL_USER, "SQL_USER configuration is required.");
assert(SQL_PASSWORD, "SQL_PASSWORD configuration is required.");

// export the configuration information
module.exports = {
    server: SQL_SERVER,
    database: SQL_DATABASE,
    user: SQL_USER,
    password: SQL_PASSWORD,
    port: Number(SQL_PORT)
};