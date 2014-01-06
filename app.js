//
// Simple SocketIO server.
// Adu Bhandaru
//


var connect = require('connect-assets'),
    express = require('express'),
    http = require('http'),
    socketio = require('socket.io');

var Game = require('./app/game').Game,
    User = require('./app/user').User,
    util = require('./app/util');


// create app, server, and bind sockets
var app = express();
var server = http.createServer(app);
var io = socketio.listen(server, {log: false});


// app config
server.listen(3000);
app.configure(function() {
  app.use(connect());
  app.use(express.static(__dirname + '/static'));
  app.use(express.static(__dirname + '/assets'));
});


// track all the games and users
var users = new util.Map();
var games = new util.Map();
var gameID = 0;
var game = null;


// set up connections
io.sockets.on('connection', function(socket) {
  // create user object
  var me = new User(socket.id, users.size(), socket);
  users.put(me.id, me);
  console.log('[info] connection', me.json());

  // resolve which game to place user in
  if (!game || !game.open()) {
    game = new Game(gameID++);
    games.put(game.id, game);
  }
  game.add(me);

  // report user to clients
  socket.emit('user', me.json());
  game.players.forEach(function(id, user) {
    if (me.id === user.id) return;
    socket.emit('player', { id: user.id, order: user.order });
    user.socket.emit('player', me.json());
  });

  // start the game if we have enough players
  if (game.full()) {
    console.log('[info] start game');
    game.players.forEach(function(id, user) {
      user.socket.emit('start');
    });
  }

  // broadcast the move
  socket.on('move', function (move) {
    console.log('[info] received move', move);
    users.forEach(function(id, user) {
      if (me.id === user.id) return;
      user.socket.emit('move', move);
    });
  });

  // user disconnection
  socket.on('disconnect', function() {
    console.log('[info] user disconnected', me.json());
    users.remove(me.id);
    users.forEach(function(id, user) {
      user.socket.emit('disconnect', me.json());
    });
  });

});
