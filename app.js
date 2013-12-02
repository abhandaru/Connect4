//
// Simple SocketIO server.
// Adu Bhandaru
//

var express = require('express');
var http = require('http');

var server = http.createServer(app);
var app = express();
var io = require('socket.io').listen(server);

app.listen(80);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
