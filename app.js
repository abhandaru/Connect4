//
// Simple SocketIO server.
// Adu Bhandaru
//

var connect = require('connect-assets');
var express = require('express');
var http = require('http');

var game = require('./app/game');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server, {log: false});

// config
server.listen(3000);
app.configure(function() {
  app.use(connect());
  app.use(express.static(__dirname + '/static'));
  app.use(express.static(__dirname + '/assets'));
});

// set up connections
var users = [ ];
var games = [ ];
io.sockets.on('connection', function(socket) {
  // create user object
  var me = { id: socket.id, order: users.length, socket: socket };

  // report user to clients
  var clientUser = { id: me.id, order: me.order };
  socket.emit('user', clientUser);
  users.forEach(function(user) {
    socket.emit('player', { id: user.id });
    user.socket.emit('player', clientUser);
  });

  // save reference to self
  users.push(me);

  // start the game if we have enough players
  if (users.length > 1) {
    console.log('[info] start game', users);
    users.forEach(function(user) {
      user.socket.emit('start');
    });
  }

  // send moves out
  socket.on('move', function (move) {
    console.log(move);
  });
});
