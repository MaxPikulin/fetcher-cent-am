const mysql = require('mysql');
const connSettings = require('./pswd');
const util = require('util');

function insert(price, table) {
  const connection = mysql.createConnection(connSettings);
  let date = (new Date).toUTCString();
  connection.query(`insert into ${table} (price, time) values ('${price}', '${date}')`, (error, results, fields) => {
    if (error) console.log(error);
  });
  connection.end();
}

async function getTasks() {
  const connection = mysql.createConnection(connSettings);
  connection.query = util.promisify(connection.query);
  let tasks = await connection.query(`select * from tasks`);
  connection.end();
  return tasks;
}

module.exports = {
  insert,
  getTasks,
};