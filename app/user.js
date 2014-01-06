// export the lib
var user = { };
module.exports = exports = user;


//
// Constructor
//

user.User = function(id, order, socket) {
  this.id = id;
  this.order = order;
  this.socket = socket;
  this._game = null;
};


//
// Instance methods
//

user.User.prototype = {

  game: function(game) {
    if (game === undefined)
      return this._game;
    this._game = game;
  },

  json: function() {
    return {
      id: this.id,
      order: this.order
    };
  }

};
