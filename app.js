//
// Simple SocketIO server.
// Adu Bhandaru
//

var connect = require('connect-assets');
var express = require('express');
var http = require('http');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server, {log: false});

// config
server.listen(3000);
app.configure(function(){
  app.use(connect());
  app.use(express.static(__dirname + '/static'));
  app.use(express.static(__dirname + '/assets'));
});

// set up sockets
io.sockets.on('connection', function (socket) {
  var count = 0;
  setInterval(function() {
    socket.emit('news', { hello: ++count });
  }, 10000);
  socket.on('my other event', function (data) {
    console.log('>>>', data);
  });
});
