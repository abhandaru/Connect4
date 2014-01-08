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
    var color = 0xAAAAAA;
    var material = new THREE.MeshPhongMaterial({
        color: color, ambient: color, specular: 0xFFFFFF, shininess: 100});
    this.base = new THREE.Mesh(
        new THREE.CylinderGeometry(
            Connect4.SIZE/2, Connect4.SIZE/2, this.thickness, 40),
        material);
    this.base.position = position.sub(offset);

    // set the mesh
    this.interactive = true;
    this.mesh(this.base);
  },


  //
  // Drops a piece down the slot.
  //

  legal: function() {
    return this.pieces.length < Connect4.HEIGHT;
  },

  move: function(player) {
    if (!this.legal()) return false;
    // this is a valid move
    var piece = new Connect4.Piece(
        this, player, this.row, this.col, this.pieces.length);
    // add to the scene
    this.add(piece);
    this.pieces.push(piece);
    return true;
  },


  //
  // Top of the stack tracks the last move.
  //

  mark: function() {
    if (!this.pieces.length) return this;
    this.pieces[this.pieces.length - 1].mark();
    return this;
  },

  unmark: function() {
    if (!this.pieces.length) return this;
    this.pieces[this.pieces.length - 1].unmark();
    return this;
  },

  //
  // Event handlers
  //

  click: function(event) {
    this.game.move(this.row, this.col);
  },

  mouseover: function(event) {
    this.game.cursor.show(this.row, this.col, this.pieces.length);
  }

});
