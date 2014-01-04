// export the lib
var game = { };
module.exports = exports = game;


//
// Constructor
//

game.Game = function(id) {
  this.id = id;
  this.players = [ ];
};


//
// Static configuration
//

game.Game.MAX_PLAYERS = 2;


//
// Instance methods
//

game.Game.prototype = {

  add: function(player) {
    if (this.players.length >= game.Game.MAX_PLAYERS)
      return false;
    // safe to add player
    this.players.push(player);
    return true;
  }

};

