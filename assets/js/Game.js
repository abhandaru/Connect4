Connect4.Game = Game3.Game.extend({

  init: function(el) {
    // logger
    this.logger = new Connect4.Logger();
    this.el.appendChild(this.logger.el);
    this.logger.impt('Welcome to Connect3d!');

    // alerts
    this.alerts = new Connect4.Alerts();

    // lights
    this.lightA = new Game3.Light(Connect4.LIGHT, new THREE.Vector3(400, 300, -400));
    this.lightB = new Game3.Light(Connect4.LIGHT, new THREE.Vector3(-400, 300, 400));
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
    this.socket = io.connect(Connect4.HOST);

    // set up players
    this.players = [ ];
    this.socket.on('user', function(user) {
      var player = new Connect4.Player(this, user);
      this.user = player;
      this.players.push(player);
      this.logger.info('Self', player.name());
    }.bind(this));
    this.socket.on('player', function(player) {
      var player = new Connect4.Player(_this, player);
      this.players.push(player);
      this.logger.info('Player connected', player.name());
    }.bind(this));

    // turn management
    this.started = false;
    this.ended = false;
    this.turns = 0;
    this.socket.on('start', this.start.bind(this));

    // receiving moves
    this.socket.on('move', function(move) {
      // match the player
      var player = null;
      for (var i = 0; i < this.players.length; i++) {
        var test = this.players[i];
        if (test.id === move.player_id) {
          player = test;
          break;
        }
      }
      // replicate move and log
      this.alerts.update();
      this.logger.info('Player moved', player.name(), '@', move.row, move.col);
      this.board.slots[move.row][move.col].move(player);
      if (move.win) {
        this.ended = true;
        this.logger.warn('Defeat!');
        this.logger.info('Refresh to play again.');
      } else
        this.next();
    }.bind(this));

    // disconnection
    this.socket.on('leave', function(data) {
      // remover player
      var player = null;
      for (var i = 0; i < this.players.length; i++) {
        var test = this.players[i];
        if (test.id === data.user.id) {
          player = this.players.splice(i, 1)[0];
          break;
        }
      }
      // notify the client
      this.alerts.update();
      this.logger.warn('Opponent disconnected', player.name());
      // has the game already ended?
      if (this.ended) return;
      // did the game just end?
      if (data.winner) {
        this.ended = true;
        if (data.winner.id === this.user.id) {
          this.logger.impt('You are victorious!');
        } else {
          this.logger.warn('Defeat!');
        }
        this.logger.info('Refresh to play again.');
      } else {
        // remaining players can still play
        // just update the current player (without changing the turn).
        this.logger.info('Continuing play...');
        this.current = this.players[this.turns % this.players.length];
      }
    }.bind(this));
  },

  start: function() {
    this.logger.impt('Start game!');
    this.alerts.update();
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
      this.logger.impt('Your move!');
    else
      this.logger.info('Waiting for opponent ...');
  },

  move: function(row, col) {
    // players have not arrived yet
    if (!this.started || this.ended) return;
    // not this players move
    if (!this.current.is(this.user)) return;

    // general case
    var player = this.current;
    var valid = this.board.slots[row][col].move(player);
    if (valid) {
      this.logger.info('You moved', player.name(), '@', row, col);
      // see if the game has ended
      this.ended = this.board.isWinner(this.current);
      this.socket.emit('move', { player_id: player.id, row: row, col: col, win: this.ended });
      if (this.ended) {
        this.logger.impt('You are victorious!');
        this.logger.info('Refresh to play again.');
      } else
        this.next();
    } else
      this.logger.warn('Invalid move @', row, col);
  },


  //
  // Event handlers
  //

  update: function(dt) {  },

  scroll: function(event) {
    var dx = event.scrollDelta().x;
    this._rotate(dx * 0.005);
  },

  mousedrag: function(event) {
    var dx = event.delta2D.x;
    this._rotate(dx * 0.005);
  },

  mouseover: function(event) {
    this.cursor.hide();
  },


  //
  // Helper functions
  //

  _rotate: function(dtheta) {
    var pos = this.camera.position;
    var radius = Math.sqrt(pos.x*pos.x + pos.z*pos.z);
    var theta = Math.atan2(pos.z, pos.x) + dtheta;
    pos.x = Math.cos(theta) * radius;
    pos.z = Math.sin(theta) * radius;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  }
});
