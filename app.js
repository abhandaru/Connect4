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
  var clientUser = { id: me.id, order: me.order };
  console.log('[info] connection', clientUser);

  // report user to clients
  socket.emit('user', clientUser);
  users.forEach(function(user) {
    socket.emit('player', { id: user.id, order: user.order });
    user.socket.emit('player', clientUser);
  });

  // save reference to self
  users.push(me);

  // start the game if we have enough players
  if (users.length >= game.MAX_PLAYERS) {
    console.log('[info] start game');
    users.forEach(function(user) {
      user.socket.emit('start');
    });
  }

  // broadcast the move
  socket.on('move', function (move) {
    console.log('[info] received move', move);
    users.forEach(function(user) {
      if (user === me) return;
      user.socket.emit('move', move);
    });
  });

});
