const puppeteer = require('puppeteer-core');

const puppSettings = {
  executablePath: '/usr/bin/chromium-browser',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
};

async function centauro(dataCent) {
  let currPrice;
  const browser = await puppeteer.launch(puppSettings);
  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
    // await page.setViewport({ width: 1024, height: 768 });
    await page.goto('https://www.centauro.net/en/', { /* waitUntil: 'networkidle2', */ timeout: 30000 });
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
    currPrice = await page.evaluate((category) => { return document.querySelector(`li[data-paquete="#paquete-37-${category}"] .big`).textContent }, dataCent.category);
    currPrice = parseFloat(currPrice.replace(/,/g, ""));
  } catch (e) { }
  await browser.close();
  return currPrice;
}

module.exports.centauro = centauro;