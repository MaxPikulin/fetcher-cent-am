const puppeteer = require('puppeteer-core');

const puppSettings = {
  executablePath: '/usr/bin/chromium-browser',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
};

async function centauro(dataCent) {
  const browser = await puppeteer.launch(puppSettings);
  const page = await browser.newPage();
  await page.goto('https://www.centauro.net/en/', { waitUntil: 'networkidle2', timeout: 100000 });
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
  await page.waitForSelector(`li[data-paquete="#paquete-37-${dataCent.category}"] .big`);
  let currPrice = await page.evaluate((category) => { return document.querySelector(`li[data-paquete="#paquete-37-${category}"] .big`).textContent }, dataCent.category);
  currPrice = parseFloat(currPrice.replace(/,/g,""));
  await browser.close();
  return currPrice;
}

module.exports.centauro = centauro;