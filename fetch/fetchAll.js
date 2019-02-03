const { centauro } = require('./centauro');
const { amazon } = require('./amazon');
const SQL = require('./sqlUtils');

(async () => {
  let tasks = await SQL.getTasks();
  for (let i = 0; i < tasks.length; i++) {
    let { type, json, tableName, title } = tasks[i];
    json = JSON.parse(json);
    let price;
    // console.time('Request');
    switch (type) {
      case 'centauro':
      price = await centauro(json);
      console.log(title, price);
      break;
      case 'amazon':
      price = await amazon(json);
      console.log(title, price);
      break;
      default:
      break;
    }
    // console.timeEnd('Request');
    await SQL.insert(price, tableName);
  }
})();
