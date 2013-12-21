Connect4.Game = Game3.Game.extend({
  init: function(el) {
    // orbit controls
    this.controls = new THREE.OrbitControls(this.camera, this.el);

    // lights
    this.light = new Game3.Light(0xFFFFFF, new THREE.Vector3(400, 300, -400));
    this.add(this.light);

    // set up the board
    this.board = new Connect4.Board(this);
    // this.add(this.board);
  },

  timerfired: function(dt) {
    // this.controls.update();
    this.board.timerfired(dt);
  }
});
