//
// Simple SocketIO server.
// Adu Bhandaru
//


var connect = require('connect-assets'),
    express = require('express'),
    http = require('http'),
    socketio = require('socket.io');

var actions = require('./app/actions'),
    config = require('./app/config'),
    Game = require('./app/game').Game,
    User = require('./app/user').User,
    util = require('./app/util');


// create app, server, and bind sockets
var app = express();
var server = http.createServer(app);
var io = socketio.listen(server, {log: false});

// log environment and config
console.log('[info] starting');
console.log('[info] environment', process.env.NODE_ENV, config.production);
console.log('[info] ports', config.prodPort, config.port);

// app config
server.listen(config.port);
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
  me.game = game;

  // report user to clients
  socket.emit('user', me.json());
  me.game.players.forEach(function(id, user) {
    if (user.is(me)) return;
    socket.emit('player', { id: user.id, order: user.order });
    user.socket.emit('player', me.json());
  });

  // start the game if we have enough players
  if (me.game.closed()) {
    console.log('[info] start game', me.game.id);
    me.game.players.forEach(function(id, user) {
      user.socket.emit('start');
    });
  }

  // broadcast the move
  socket.on('move', function (move) {
    console.log('[info] received move', move);
    actions.move(me, move);
  });

  // user forfeit
  socket.on('forfeit', function() {
    console.log('[info] user forfeit', me.json());
    actions.forfeit(me);
  });

  // user disconnection
  socket.on('disconnect', function() {
    console.log('[info] user disconnected', me.json());
    actions.disconnect(games, users, me);
  });

});
