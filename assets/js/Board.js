Connect4.Board = Game3.Model.extend({

  init: function(game) {
    // track check functions
    this.checks = [
      this._checkRow,
      this._checkCol,
      this._checkVertical,
      this._checkPosDiag,
      this._checkNegDiag,
      this._checkYZPosDiag,
      this._checkYZNegDiag,
      this._checkXYPosDiag,
      this._checkXYNegDiag,
      this._checkXYZPosDiag,
      this._checkXYZNegDiag,
      this._checkNegXYZPosDiag,
      this._checkNegXYZNegDiag
    ];
    this.mark = false;

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

  //
  // Win check.
  // TODO: This could obviously be done more efficiently, but we will save
  //   the optimizations for later.
  //

  winner: function(player) {
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
    var args = [player, row, col, plane];
    for (var i = 0; i < this.checks.length; i++) {
      if (this.checks[i].apply(this, args)) {
        // A winning sequence was found, marks the pieces.
        this.mark = true;
        this.checks[i].apply(this, args);
        this.mark = false;
        return true;
      }
    }
    return false;
  },

  //
  // XZ plane
  //

  _checkRow: function(player, row, col, plane) {
    for (var i = 0; i < Connect4.GOAL; i++) {
      var piece = this._get(row, col + i, plane);
      if (!piece || !piece.owner.is(player))
        return false;
    }
    return true;
  },

  _checkCol: function(player, row, col, plane) {
    for (var i = 0; i < Connect4.GOAL; i++) {
      var piece = this._get(row + i, col, plane);
      if (!piece || !piece.owner.is(player))
        return false;
    }
    return true;
  },

  _checkPosDiag: function(player, row, col, plane) {
    for (var i = 0; i < Connect4.GOAL; i++) {
      var piece = this._get(row + i, col + i, plane);
      if (!piece || !piece.owner.is(player))
        return false;
    }
    return true;
  },

  _checkNegDiag: function(player, row, col, plane) {
    for (var i = 0; i < Connect4.GOAL; i++) {
      var piece = this._get(row + i, col - i, plane);
      if (!piece || !piece.owner.is(player))
        return false;
    }
    return true;
  },

  //
  // YZ plane
  //

  _checkVertical: function(player, row, col, plane) {
    for (var i = 0; i < Connect4.GOAL; i++) {
      var piece = this._get(row, col, plane + i);
      if (!piece || !piece.owner.is(player))
        return false;
    }
    return true;
  },

  _checkYZPosDiag: function(player, row, col, plane) {
    for (var i = 0; i < Connect4.GOAL; i++) {
      var piece = this._get(row + i, col, plane + i);
      if (!piece || !piece.owner.is(player))
        return false;
    }
    return true;
  },

  _checkYZNegDiag: function(player, row, col, plane) {
    for (var i = 0; i < Connect4.GOAL; i++) {
      var piece = this._get(row + i, col, plane - i);
      if (!piece || !piece.owner.is(player))
        return false;
    }
    return true;
  },

  //
  // XY Plane
  //

  _checkXYPosDiag: function(player, row, col, plane) {
    for (var i = 0; i < Connect4.GOAL; i++) {
      var piece = this._get(row, col + i, plane + i);
      if (!piece || !piece.owner.is(player))
        return false;
    }
    return true;
  },

  _checkXYNegDiag: function(player, row, col, plane) {
    for (var i = 0; i < Connect4.GOAL; i++) {
      var piece = this._get(row, col + i, plane - i);
      if (!piece || !piece.owner.is(player))
        return false;
    }
    return true;
  },

  //
  // Positive diagonal plane
  //

  _checkXYZPosDiag: function(player, row, col, plane) {
    for (var i = 0; i < Connect4.GOAL; i++) {
      var piece = this._get(row + i, col + i, plane + i);
      if (!piece || !piece.owner.is(player))
        return false;
    }
    return true;
  },

  _checkXYZNegDiag: function(player, row, col, plane) {
    for (var i = 0; i < Connect4.GOAL; i++) {
      var piece = this._get(row + i, col + i, plane - i);
      if (!piece || !piece.owner.is(player))
        return false;
    }
    return true;
  },

  //
  // Positive diagonal plane
  //

  _checkNegXYZPosDiag: function(player, row, col, plane) {
    for (var i = 0; i < Connect4.GOAL; i++) {
      var piece = this._get(row + i, col - i, plane + i);
      if (!piece || !piece.owner.is(player))
        return false;
    }
    return true;
  },

  _checkNegXYZNegDiag: function(player, row, col, plane) {
    for (var i = 0; i < Connect4.GOAL; i++) {
      var piece = this._get(row + i, col - i, plane - i);
      if (!piece || !piece.owner.is(player))
        return false;
    }
    return true;
  },

  //
  // Helpers
  //

  _get: function(row, col, plane) {
    // get the slot
    var slot = this.slots[row] && this.slots[row][col];
    if (!slot) return false;
    // get the piece
    var piece = slot.pieces.length > plane && slot.pieces[plane];
    // mark if needed
    if (this.mark) piece.mark();
    return piece;
  }

});
