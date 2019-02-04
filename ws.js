const WebSocket = require('ws');

const wss = new WebSocket.Server({port: 8010});

wss.on('connection', function connection(ws) {
  console.log('connected');
  // let interval = setInterval(()=>{ws.send(new Date().toLocaleString());}, 2000);
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    // ws.send(message + ' to you too!');
  });
  ws.on('close', () => {
    console.log('connection closed.');
    clearInterval(interval);
  });
});
