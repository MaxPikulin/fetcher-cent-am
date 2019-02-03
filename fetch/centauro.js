const puppeteer = require('puppeteer-core');
const mysql = require('mysql');
const connSettings = require('./pswd');

const connection = mysql.createConnection(connSettings);
const puppSettings = {
  executablePath: '/usr/bin/chromium-browser',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
};


async function centauro(dataCent) {
  console.time('Request');
  // console.log('before');
  const browser = await puppeteer.launch(puppSettings);
  const page = await browser.newPage();
  // await page.waitFor(1000);
  // console.log('after');
  await page.goto(dataCent.url);
  await page.waitForSelector('#FechaDevolucionValue');
  await page.evaluate((fromDate, toDate) => {
    document.querySelector('#SucursalRecogida').value = 190;
    document.querySelector('#SucursalDevolucion').value = 190;
    document.querySelector('#FechaRecogidaValue').value = fromDate;
    document.querySelector('#FechaDevolucionValue').value = toDate;
  }, dataCent.fromDate, dataCent.toDate);
  await page.type('#SucursalRecogidaNombre', 'Faro - Airport');
  await page.type('#SucursalDevolucionNombre', 'Faro - Airport');
  await page.evaluate(() => {
    document.querySelector('.btn-centauro-blue').click();
  });
  // await page.click('.btn-centauro-blue');
  await page.waitForSelector(`li[data-paquete="#paquete-37-${dataCent.category}"] .big`);
  let currPrice = await page.evaluate((category) => { return document.querySelector(`li[data-paquete="#paquete-37-${category}"] .big`).textContent }, dataCent.category);
  currPrice = parseFloat(currPrice);
  
  await browser.close();
  
  // function comparePrices(curr, prev) {
  //   console.log('prev:', prev);
  //   console.log('curr:', curr);
  //   if (prev != 0 && curr != prev) {
  //     mail(`Now ${curr}. (was ${prev})`, '.');
  //   }
  //   prevPrice = curr;
  // }

  // connection.query(`select * from centauro where id=(select max(id) from centauro)`, (error, results, fields) => {
  //   if (error) console.log(error);
  //   comparePrices(currPrice, results[0].price);
  //   // prevPrice = results[0].price;
  // });
  // let date = (new Date).toUTCString();
  // connection.query(`insert into centauro (price, time) values ('${currPrice}', '${date}')`, (error, results, fields) => {
  //   if (error) console.log(error);
  // });
  // connection.end();
  // // console.log(prevPrice);

  console.timeEnd('Request');
  return currPrice;
}

module.exports.centauro = centauro;