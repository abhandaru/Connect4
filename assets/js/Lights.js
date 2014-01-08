Connect4.Lights = Game3.Model.extend({

  init: function(game) {
    var nearColor = 0xAAAAAA;
    var farColor = 0x555555;

    this.lights = [
      new Game3.Light(farColor, new THREE.Vector3(500, 400, 500)),
      new Game3.Light(nearColor, new THREE.Vector3(-500, 300, 500)),
      new Game3.Light(farColor, new THREE.Vector3(-500, 400, -500)),
      new Game3.Light(nearColor, new THREE.Vector3(500, 300, -500))
    ];

    // add to the scene
    for (var i = 0; i < this.lights.length; i++) {
      this.add(this.lights[i]);
    }
  }

});
