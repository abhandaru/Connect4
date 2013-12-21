Connect4.Game = Game3.Game.extend({
  init: function(el) {
    this.board = new Connect4.Board(this);

    this.add(this.board);
  },

  timerfired: function(dt) {
    this.board.timerfired(dt);
  }
});
