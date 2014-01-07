Connect4.Player = Game3.Class.extend({

  init: function(game, data) {
    this.id = data.id;
    this._order = -1;
    this.color = 0xAAAAAA;
  },

  order: function(order) {
    if (order === undefined) return this._order;
    this._order = order;
    // determine color
    var index = order % Connect4.COLORS.length;
    this.color = Connect4.COLORS[index];
  },

  name: function() {
    return this.id.substr(0, 8);
    // return (this.order() > 0) ? 'player' + this.order() : this.id;
  },

  is: function(that) {
    return this.id === that.id;
  }

});


//
// Static functions
//

Connect4.Player.compare = function(a, b) {
  if (a.id < b.id) return -1;
  else if (a.id > b.id) return 1;
  else return 0;
};
