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
  },

  isWinner: function(player) {
    for (var row = 0; row < this.slots.length; row++) {
      for (var col = 0; col < this.slots[0].length; col++) {
        for (var plane = 0; plane < Connect4.HEIGHT; plane++) {
          if(this._check(player, row, col, plane))
            return true;
        }
      }
    }
    return false;
  },

  _check: function(player, row, col, plane) {
    // check the column
    if (this._checkCol(player, row, col, plane))
      return true;
  },

  _checkCol: function(player, row, col, plane) {
    var goal = Connect4.GOAL;
    for (var i = row; i < row + goal; i++) {
      var piece = this._get(i, col, plane);
      if (!piece || !piece.owner.is(player))
        return false;
    }
    return true;
  },

  _get: function(row, col, plane) {
    // get the slot
    var slot = this.slots[row] && this.slots[row][col];
    if (!slot) return false;
    // get the piece
    var piece = slot.pieces.length > plane && slot.pieces[plane];
    return piece;
  }

});
