Connect4.Player = Game3.Class.extend({

  init: function(game, data) {
    this.id = data.id;
    this._order = -1;
    // default colors
    this.color = 0xAAAAAA;
    this.highlight = 0x555555;
  },

  order: function(order) {
    if (order === undefined) return this._order;
    this._order = order;
    // determine color
    var index = order % Connect4.colors.length;
    this.color = Connect4.colors[index];
    this.highlight = Connect4.highlights[index];
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
