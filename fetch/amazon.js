const puppeteer = require('puppeteer-core');

const puppSettings = {
  executablePath: '/usr/bin/chromium-browser',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
};

async function amazon(itemToGet) {
  const browser = await puppeteer.launch(puppSettings);
  const page = await browser.newPage();
  await page.goto(itemToGet.url, { waitUntil: 'networkidle2', timeout: 100000 });
  await page.waitForSelector('#price_inside_buybox');
  let currPrice = await page.evaluate(() => { return document.querySelector('#price_inside_buybox').textContent });
  currPrice = parseFloat(currPrice.replace(/[,£]/g,""));
  await browser.close();
  return currPrice;
}

module.exports.amazon = amazon;