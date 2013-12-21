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
  },

  click: function(event) {
    this.pause = !this.pause;
  },

  timerfired: function() {
    if (this.pause) return;
    this.geo.rotation.x += 0.01;
    this.geo.rotation.y += 0.02;
  }
});
