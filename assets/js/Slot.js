Connect4.Slot = Game3.Model.extend({
  init: function(game, row, col) {
    this.base =new THREE.Mesh(
        new THREE.CylinderGeometry(Connect4.SIZE/2, Connect4.SIZE/2, 5, 40),
        new THREE.MeshLambertMaterial());

    // determine position
    var offset = new THREE.Vector3(
        Connect4.SIZE * Connect4.COLS/2, 0, Connect4.SIZE * Connect4.ROWS/2)
    var position = new THREE.Vector3(
        Connect4.SIZE * col, 0, Connect4.SIZE * row);
    this.base.position = position.sub(offset);

    // set the mesh
    this.mesh(this.base);
  }
});
