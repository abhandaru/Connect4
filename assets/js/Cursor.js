Connect4.Cursor = Game3.Model.extend({

  init: function(game) {
    this.row = -1;
    this.col = -1;
    this.height = -1;
    this.radius = Connect4.SIZE/2;

    // set up the cursor mesh
    this.material = new THREE.MeshLambertMaterial({
        transparent: true, opacity: 0.5});
    this.ghost = new THREE.Mesh(
        new THREE.SphereGeometry(this.radius, 40, 40), this.material);

    // clean up
    this.mesh(this.ghost);
    this.hide();
  },

  show: function(row, col, height) {
    this._move(row, col, height);
    this.mesh().visible = true;
  },

  hide: function() {
    this.mesh().visible = false;
  },


  //
  // Private methods
  //

  _move: function(row, col, height) {
    this.row = row;
    this.col = col;
    this.height = height;
    var mesh = this.mesh();
    mesh.position = this._getPosition(row, col, height);
  },

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
