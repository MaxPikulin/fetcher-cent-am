const puppeteer = require('puppeteer-core');

const puppSettings = {
  executablePath: '/usr/bin/chromium-browser',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
};

async function amazon(itemToGet) {
  const browser = await puppeteer.launch(puppSettings);
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
  // await page.setViewport({ width: 1024, height: 768 });
  try {
    await page.goto(itemToGet.url, { /* waitUntil: 'domcontentloaded', */ timeout: 30000 });

  } catch (e) { }
  // await page.waitForSelector('#price_inside_buybox');
  let currPrice;
  try {
    currPrice = await page.evaluate(() => { return document.querySelector('#priceblock_ourprice').textContent }); // price_inside_buybox
    currPrice = parseFloat(currPrice.replace(/[,£]/g, ""));
  } catch (e) { }
  await browser.close();
  return currPrice;
}

module.exports.amazon = amazon;