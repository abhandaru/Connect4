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

    // set up sockets
    var _this = this;
    this.socket = io.connect('http://localhost');

    // set up players
    this.players = [ ];
    this.socket.on('user', function(user) {
      var player = new Connect4.Player(_this, user);
      _this.user = player;
      _this.players.push(player);
      _this.add(player);
    });
    this.socket.on('player', function(player) {
      var player = new Connect4.Player(_this, player);
      _this.players.push(player);
      _this.add(player);
    })

    // turn management
    this.started = false;
    this.turns = 0;
    this.socket.on('start', function(data) {
      _this.start();
    });

    // receiving moves
    this.socket.on('move', function(move) {
      console.log('[info] received move', move);
      var player;
      for (var i = 0; i < this.players.length; i++) {
        var test = this.players[i];
        if (test.id == move.player_id)
          player = test;
      }
      this.board.slots[move.row][move.col].move(player);
      this.next();
    }.bind(this));
  },

  start: function() {
    this.players.sort(Connect4.Player.compare); // get total ordering
    this.started = true;
    this.next();
  },

  next: function() {
    this.current = this.players[this.turns % this.players.length];
    this.turns++;
  },

  move: function(row, col) {
    // players have not arrived yet
    if (!this.started) return;
    // not this players move
    if (this.user.id != this.current.id) return;

    // general case
    var player = this.current;
    var valid = this.board.slots[row][col].move(player);
    if (valid) {
      this.socket.emit('move', { player_id: player.id, row: row, col: col });
      this.next();
    }
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
