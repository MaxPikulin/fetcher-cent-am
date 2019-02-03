const { centauro } = require('./centauro');

const dataCent = {
  toDate: '05/03/2019',
  fromDate: '21/02/2019',
  category: 'A',
  url: 'https://www.centauro.net/en/',
};

(async () => {
  let price = await centauro(dataCent);
  console.log(price);
})();
