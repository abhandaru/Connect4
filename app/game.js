var util = require('./util');


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
  this.players = new util.Map();
  this.ended = false;
};


//
// Instance methods
//

game.Game.prototype = {

  open: function() {
    return !this.ended && (this.players.size() < game.MAX_PLAYERS);
  },


  closed: function() {
    return !this.open();
  },

  add: function(player) {
    if (!this.open()) return false;
    // safe to add player
    this.players.put(player.id, player);
    return true;
  }

};
