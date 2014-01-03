Connect4.Game = Game3.Game.extend({

  init: function(el) {
    // orbit controls
    this.controls = new THREE.TrackballControls(this.camera, this.el);
    this.controls.autoRotate = true;

    // lights
    this.light = new Game3.Light(0xFFFFFF, new THREE.Vector3(400, 300, -400));
    this.add(this.light);

    // set up the board
    this.board = new Connect4.Board(this);
    this.add(this.board);

    // set up cursor
    this.cursor = new Connect4.Cursor(this);
    this.add(this.cursor);

    // player sockets
    var _this = this;
    this.players = [ ];
    this.socket = io.connect('http://localhost');
    this.socket.on('player', function(player) {
      var player = new Connect4.Player(_this, player);
      _this.add(player);
      _this.players.push(player);
      //
      if (_this.players.length) _this.next();
    });

    // turn management
    this.turns = 0;
  },

  next: function() {
    this.current = this.players[this.turns % this.players.length];
    this.turns++;
  },

  move: function(row, col) {
    // players have not arrived yet
    if (!this.turns) return;
    var player = this.current;
    var valid = this.board.slots[row][col].move(player);
    if (valid)
      this.next();
    else
      console.log('[invalid] move invalid.');
  },

  //
  // Event handlers
  //

  update: function(dt) {
    this.controls.update();
  },

  mouseover: function(event) {
    this.cursor.hide();
  }

});
