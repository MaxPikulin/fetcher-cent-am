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

async function differentFromLast(price, table) {
  const connection = mysql.createConnection(connSettings);
  connection.query = util.promisify(connection.query);
  let lastRow = await connection.query(`select price from ${table} where id=(select max(id) from ${table})`);
  // console.log(lastRow);
  if (!lastRow.length) return true;
  let lastPrice = lastRow[0].price;
  connection.end();
  console.log(lastPrice, price);
  if (lastPrice != price) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  insert,
  getTasks,
  differentFromLast,
};