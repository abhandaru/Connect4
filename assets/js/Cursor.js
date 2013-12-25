Connect4.Cursor = Game3.Model.extend({

  init: function(game) {
    this.row = -1;
    this.col = -1;
    this.radius = Connect4.SIZE/2;
    this.height = 400;

    // set up the cursor mesh
    this.material = new THREE.MeshLambertMaterial(
      {transparent: true, opacity: 0.5});
    this.column = new THREE.Mesh(
        new THREE.CylinderGeometry(
          this.radius, this.radius, this.height, 40), this.material);

    // clean up
    this.mesh(this.column);
    this.hide();
  },

  show: function(row, col) {
    this._move(row, col);
    this.mesh().visible = true;
  },

  hide: function() {
    this.mesh().visible = false;
  },


  //
  // Private methods
  //

  _move: function(row, col) {
    this.row = row;
    this.col = col;
    var mesh = this.mesh();
    mesh.position = this._getPosition(row, col);
  },

  _getPosition: function(row, col) {
    // determine position
    var offset = new THREE.Vector3(
        Connect4.SIZE * Connect4.COLS/2 - Connect4.SIZE/2, 0,
        Connect4.SIZE * Connect4.ROWS/2 - Connect4.SIZE/2)
    var position = new THREE.Vector3(
        Connect4.SIZE * col, this.height/2,
        Connect4.SIZE * row);
    return position.sub(offset);
  }

});
