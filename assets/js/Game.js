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
      this.user = player;
      this.players.push(player);
      this.logger.info('self', player.name());
    }.bind(this));
    this.socket.on('player', function(player) {
      var player = new Connect4.Player(_this, player);
      this.players.push(player);
      this.logger.info('player connected', player.name());
    }.bind(this));

    // turn management
    this.started = false;
    this.turns = 0;
    this.socket.on('start', function(data) {
      _this.start();
    });

    // receiving moves
    this.socket.on('move', function(move) {
      var player = null;
      for (var i = 0; i < this.players.length; i++) {
        var test = this.players[i];
        if (test.id === move.player_id) {
          player = test;
          break;
        }
      }
      // replicate move and log
      this.logger.info('Player move', player.name(), '@', move.row, move.col);
      this.board.slots[move.row][move.col].move(player);
      this.next();
    }.bind(this));

    // disconnection
    this.socket.on('disconnect', function(data) {
      // remover player
      var player = null;
      for (var i = 0; i < this.players.length; i++) {
        var test = this.players[i];
        if (test.id === data.user.id) {
          player = this.players.splice(i, 1)[0];
          break;
        }
      }
      // notify the opponents
      this.logger.warn('Player disconnected', player.name());
      // did the game end?
      if (data.winner) {
        if (data.winner.id === this.user.id)
          this.logger.gogo('You are victorious!');
        else
          this.logger.warn('Defeat!');
      }
    }.bind(this));
  },

  start: function() {
    this.logger.gogo('Start game!');
    // get total ordering
    this.players.sort(Connect4.Player.compare);
    this.players.forEach(function(player, index) {
      player.order(index);
    });
    // get first player
    this.started = true;
    this.next();
  },

  next: function() {
    this.current = this.players[this.turns % this.players.length];
    this.turns++;
    // notify user if it is their move
    if (this.current.is(this.user))
      this.logger.gogo('Your turn!');
  },

  move: function(row, col) {
    // players have not arrived yet
    if (!this.started) return;
    // not this players move
    if (!this.current.is(this.user)) return;

    // general case
    var player = this.current;
    var valid = this.board.slots[row][col].move(player);
    if (valid) {
      this.socket.emit('move', { player_id: player.id, row: row, col: col });
      this.next();
      this.logger.info('Player move', player.name(), '@', row, col);
    } else
      this.logger.warn('Invalid move @', row, col);
  },


  //
  // Event handlers
  //

  update: function(dt) {  },

  scroll: function(event) {
    var dx = event.scrollDelta().x;
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
