require("dotenv").config();
const pgp = require("pg-promise")();

var username = process.env.PGUSER;
var password = process.env.PGPASSWORD;
var host = process.env.PGHOST;
var database = process.env.PGDATABASE;
var port = process.env.PGPORT;

const connectionString = `postgresql://${username}:${password}@${host}:${port}/${database}`;
const db = pgp(connectionString);

module.exports = db;
