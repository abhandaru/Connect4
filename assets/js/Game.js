Connect4.Game = Game3.Game.extend({
  init: function(el) {
    // orbit controls
    this.controls = new THREE.TrackballControls(this.camera, this.el);
    this.controls.autoRotate = true;

    // lights
    this.light = new Game3.Light(0xFFFFFF, new THREE.Vector3(400, 300, -400));
    this.add(this.light);

    // set up the board
    this.board = new Connect4.Board(this);
    this.add(this.board);

    // set up cursor
    this.cursor = new Connect4.Cursor(this);
    this.add(this.cursor);
  },

  update: function(dt) {
    this.controls.update();
    this.board.update(dt);
  },

  mouseover: function(event) {
    // this.cursor.hide();
  }
});
