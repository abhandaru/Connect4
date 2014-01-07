Connect4.Game = Game3.Game.extend({

  init: function(el) {
    // logger
    this.logger = new Connect4.Logger();
    this.el.appendChild(this.logger.el);

    // lights
    this.lightA = new Game3.Light(0xBBBBBB, new THREE.Vector3(400, 300, -400));
    this.lightB = new Game3.Light(0xBBBBBB, new THREE.Vector3(-400, 300, 400));
    this.add(this.lightA);
    this.add(this.lightB);

    // set up the board
    this.board = new Connect4.Board(this);
    this.add(this.board);

    // set up cursor
    this.cursor = new Connect4.Cursor(this);
    this.add(this.cursor);

    // set up sockets
    var _this = this;
    this.socket = io.connect('http://' + Connect4.IP);

    // set up players
    this.players = [ ];
    this.socket.on('user', function(user) {
      var player = new Connect4.Player(_this, user);
      _this.user = player;
      _this.players.push(player);
      _this.add(player);
      console.log('[info] self', player);
      _this.logger.info('self', player.id);
    });
    this.socket.on('player', function(player) {
      var player = new Connect4.Player(_this, player);
      _this.players.push(player);
      _this.add(player);
      console.log('[info] player connected', player);
      _this.logger.info('player connected', player.id);
    });

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
    // get total ordering
    this.players.sort(Connect4.Player.compare);
    this.players.forEach(function(player, index) {
      player.order(index);
    });
    // get first player
    this.current = this.players[this.turns % this.players.length];
    this.started = true;
    // logging
    console.log('[info] start game', this.current);
    this.logger.info('start game', this.current.id);
  },

  next: function() {
    this.turns++;
    this.current = this.players[this.turns % this.players.length];
    console.log('[info] next turn', this.current);
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

  update: function(dt) {  },

  mousedrag: function(event) {
    var dx = event.delta2D.x;
    var pos = this.camera.position;
    var radius = Math.sqrt(pos.x*pos.x + pos.z*pos.z);
    var theta = Math.atan2(pos.z, pos.x) + dx * 0.005;
    pos.x = Math.cos(theta) * radius;
    pos.z = Math.sin(theta) * radius;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  },

  mouseover: function(event) {
    this.cursor.hide();
  }

});
