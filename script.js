containerDiv = document.querySelector('.container');
const body = {
  query: 'select * from SSD2TB order by id desc',
};
const ws = new WebSocket('ws://zavit.com:8010');

ws.onopen = function() {
  ws.send('Hello Server!');
}
ws.onmessage = function(event) {
  prependRow(event.data);
}

function prependRow(data) {
  containerDiv.innerHTML = `<div class="newData">${data}</div>` + containerDiv.innerHTML;
}

async function init() {
  let result = await fetch('../api/mysqlAPI.js', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  result = await result.json();
  containerDiv.innerHTML = makeTable(result);
}

function makeTable(data) {
  let table = '<table class="mainTable"><tr>';
  for (let column in data[0]) {
    table += `<th>${column}</th>`;
  }
  table += '</tr>';
  for (let row in data) {
    table += '<tr>';
    for (let element in data[row]) {
      table += `<td>${data[row][element]}</td>`;
    }
    table += '</tr>';
  }
  table += '</table>';
  return table;
}

document.addEventListener('DOMContentLoaded', init);