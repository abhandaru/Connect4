// export the lib
var actions = { };
module.exports = exports = actions;


//
// Constants
//

actions.DISCONNECT = 'disconnected';
actions.FORFEIT = 'forfeited';


//
// Actions to invoke from socket events.
//

actions.move = function(user, move) {
  user.game.players.forEach(function(id, other) {
    if (other.is(user)) return;
    other.socket.emit('move', move);
  });
};


actions.forfeit = function(user) {
  actions.leave(user, actions.FORFEIT);
};


actions.disconnect = function(games, users, user) {
  // update game and users
  var game = user.game;
  game.players.remove(user.id);
  users.remove(user.id);

  // broadcast leave event
  actions.leave(user, actions.DISCONNECT);

  // remove game reference
  if (!game.players.size()) {
    games.remove(game.id);
    user.game = null;
  }
};


actions.leave = function(user, type) {
  // end game logic
  var game = user.game;
  var data = { user: user.json(), action: type };
  var players = game.players;
  game.ended = players.size() <= 1;
  game.players.forEach(function(id, user) {
    if (game.ended)
      data.winner = user.json();
    user.socket.emit('leave', data);
  });
};
