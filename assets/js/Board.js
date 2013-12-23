Connect4.Board = Game3.Model.extend({
  init: function(game) {
    // set up geometry
    this.pause = false;
    this.geo = new THREE.Mesh(
        new THREE.IcosahedronGeometry(200, 1),
        new THREE.MeshNormalMaterial());
    // set object
    this.interactive = true;
    this.mesh(this.geo);

    // create slots
    this.slots = [ ];
    for (var i = 0; i < Connect4.ROWS; i++) {
      var row = [ ];
      for (var j = 0; j < Connect4.COLS; j++) {
        var slot = new Connect4.Slot(game, i, j);
        row.push(slot);
        this.add(slot);
      }
      this.slots.push(row);
    }
  },

  click: function(event) {
    this.pause = !this.pause;
  },

  update: function() {
    if (this.pause) return;
    this.geo.rotation.x += 0.01;
    this.geo.rotation.y += 0.02;
  }
});
