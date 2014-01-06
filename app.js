//
// Simple SocketIO server.
// Adu Bhandaru
//

var connect = require('connect-assets');
var express = require('express');
var http = require('http');
var socketio = require('socket.io');

var game = require('./app/game');
var util = require('./app/util');

var app = express();
var server = http.createServer(app);
var io = socketio.listen(server, {log: false});

// config
server.listen(3000);
app.configure(function() {
  app.use(connect());
  app.use(express.static(__dirname + '/static'));
  app.use(express.static(__dirname + '/assets'));
});

// set up connections
var users = new util.Map();
var games = new util.Map();
io.sockets.on('connection', function(socket) {
  // create user object
  var me = { id: socket.id, order: users.size(), socket: socket };
  var clientUser = { id: me.id, order: me.order };
  console.log('[info] connection', clientUser);

  // report user to clients
  socket.emit('user', clientUser);
  users.forEach(function(id, user) {
    socket.emit('player', { id: user.id, order: user.order });
    user.socket.emit('player', clientUser);
  });

  // save reference to self
  users.put(me.id, me);

  // start the game if we have enough players
  if (users.size() >= game.MAX_PLAYERS) {
    console.log('[info] start game');
    users.forEach(function(id, user) {
      user.socket.emit('start');
    });
  }

  // broadcast the move
  socket.on('move', function (move) {
    console.log('[info] received move', move);
    users.forEach(function(id, user) {
      if (user === me) return;
      user.socket.emit('move', move);
    });
  });

});
