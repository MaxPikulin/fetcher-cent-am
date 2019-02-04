const { centauro } = require('./centauro');
const { amazon } = require('./amazon');
const SQL = require('./sqlUtils');

fetchAll();
setInterval(fetchAll, 1000 * 60 * 60);

async function fetchAll() {
  console.log(new Date().toString());
  let tasks = await SQL.getTasks();
  for (let i = 0; i < tasks.length; i++) {
    let { type, json, tableName, title } = tasks[i];
    json = JSON.parse(json);
    let price;
    console.time('Request');
    switch (type) {
      case 'amazon':
        price = await amazon(json);
        console.log(title, price);
        break;
      case 'centauro':
        price = await centauro(json);
        console.log(title, price);
        break;

      default:
        break;
    }
    console.timeEnd('Request');
    console.log(typeof price === 'number' && price > 0);
    if (typeof price === 'number' && price > 0 && await SQL.differentFromLast(price, tableName)) {
      console.log('Price is different, adding new row.');
      await SQL.insert(price, tableName);
    }
  }
  console.log();
};
