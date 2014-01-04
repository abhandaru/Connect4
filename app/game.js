// export the lib
var game = { };
module.exports = exports = game;

//
// Static configuration
//

game.MAX_PLAYERS = 2;


//
// Constructor
//

game.Game = function(id) {
  this.id = id;
  this.players = [ ];
};


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

