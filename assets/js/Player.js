Connect4.Player = Game3.Model.extend({

  init: function(game, data) {
    this.id = data.id;

    // determine color
    var colors = [ 0x0000FF, 0xFF0000 ];
    var index = this.id % colors.length;
    this.color = colors[index];
  }

});
