Connect4.Slot = Game3.Model.extend({

  init: function(game, row, col) {
    this.row = row;
    this.col = col;
    this.thickness = 3;
    this.pieces = [ ];

    // determine position
    var offset = new THREE.Vector3(
        Connect4.SIZE * Connect4.COLS/2 - Connect4.SIZE/2, 0,
        Connect4.SIZE * Connect4.ROWS/2 - Connect4.SIZE/2)
    var position = new THREE.Vector3(
        Connect4.SIZE * col, 0,
        Connect4.SIZE * row);

    // set up the base
    this.base = new THREE.Mesh(
        new THREE.CylinderGeometry(
          Connect4.SIZE/2, Connect4.SIZE/2, this.thickness, 40),
        new THREE.MeshLambertMaterial());
    this.base.position = position.sub(offset);

    // set the mesh
    this.interactive = true;
    this.mesh(this.base);
  },

  move: function(player) {
    if (this.pieces.length >= Connect4.HEIGHT) return false;
    // this is a valid move
    var piece = new Connect4.Piece(
        this, player, this.row, this.col, this.pieces.length);
    this.add(piece);
    this.pieces.push(piece);
    return true;
  },

  click: function(event) {
    this.game.move(this.row, this.col);
  },

  mouseover: function(event) {
    this.game.cursor.show(this.row, this.col);
  }

});
