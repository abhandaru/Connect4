Connect4.Piece = Game3.Model.extend({

  init: function(game, player, row, col, height) {
    this.owner = player;
    this.color = player.color;
    this.highlight = player.highlight;
    this.marked = false;

    // create texture
    this.material = new THREE.MeshPhongMaterial({
        color: this.color, ambient: this.color, specular: 0xAAAAAA, shininess: 100});

    // create geometry
    var radius = Connect4.SIZE/2;
    this.piece = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 40, 40), this.material);
    this.piece.position = this._getPosition(row, col, height);

    // cleanup
    this.interactive = true;
    this.mesh(this.piece);
  },

  mark: function() {
    this.marked = true;
    this.material.color.setHex(this.highlight);
  },

  unmark: function() {
    this.marked = false;
    this.material.color.setHex(this.color);
  },


  //
  // Private methods
  //

  _getPosition: function(row, col, height) {
    // determine position
    var offset = new THREE.Vector3(
        Connect4.SIZE * Connect4.COLS/2 - Connect4.SIZE/2, 0,
        Connect4.SIZE * Connect4.ROWS/2 - Connect4.SIZE/2)
    var position = new THREE.Vector3(
        Connect4.SIZE * col,
        Connect4.SIZE * height + Connect4.SIZE/2,
        Connect4.SIZE * row);
    return position.sub(offset);
  }
});
