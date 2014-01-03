Connect4.Board = Game3.Model.extend({

  init: function(game) {
    // create slots
    this.slots = [ ];
    for (var i = 0; i < Connect4.ROWS; i++) {
      var row = [ ];
      for (var j = 0; j < Connect4.COLS; j++) {
        var slot = new Connect4.Slot(game, i, j);
        row.push(slot);
        this.add(slot);
      }
      this.slots.push(row);
    }
  }

});
