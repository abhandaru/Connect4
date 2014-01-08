Connect4.Piece = Game3.Model.extend({

  init: function(game, player, row, col, height) {
    this.owner = player;
    this.color = player.color;

    var radius = Connect4.SIZE/2;
    var material = new THREE.MeshPhongMaterial({
        color: this.color, ambient: this.color, specular: 0xAAAAAA, shininess: 100});
    var mesh = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 40, 40), material);
    mesh.position = this._getPosition(row, col, height);

    // cleanup
    this.interactive = true;
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
