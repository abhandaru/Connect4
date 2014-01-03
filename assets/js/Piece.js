Connect4.Piece = Game3.Model.extend({

  init: function(game, player, row, col, height) {
    this.playerId = player.id;
    this.color = player.color;

    var radius = Connect4.SIZE/2 * 0.8;
    var mesh = new THREE.Mesh(
        new THREE.SphereGeometry(radius),
        new THREE.MeshLambertMaterial({ color: this.color }));
    mesh.position = this._getPosition(row, col, height);

    // cleanup
    this.mesh(mesh);
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
