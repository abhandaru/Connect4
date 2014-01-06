Connect4.Player = Game3.Class.extend({

  init: function(game, data) {
    this.id = data.id;
    this.order = data.order;

    // determine color
    var colors = [ 0x0000FF, 0xFF0000, 0x00FF00 ];
    var index = this.order % colors.length;
    this.color = colors[index];
    console.log(this);
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
