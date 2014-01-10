Connect4.Game = Game3.Game.extend({

  init: function(el) {
    // logger
    this.logger = new Connect4.Logger();
    this.el.appendChild(this.logger.el);
    this.logger.impt(Connect4.strings.welcome);

    // alerts
    this.alerts = new Connect4.Alerts();

    // lights
    this.lights = new Connect4.Lights(this);
    this.add(this.lights);

    // set up the board
    this.board = new Connect4.Board(this);
    this.add(this.board);

    // set up cursor
    this.cursor = new Connect4.Cursor(this);
    this.add(this.cursor);

    // set up sockets
    this.socket = io.connect(Connect4.HOST);

    // turn management
    this.started = false;
    this.ended = false;
    this.turns = 0;
    this.lastMove = null;
    this.socket.on('start', this.start.bind(this));

    // set up players
    this.players = [ ];
    this.socket.on('user', function(user) {
      var player = new Connect4.Player(this, user);
      this.user = player;
      this.players.push(player);
      this.logger.info('Identity', player.name());
      this.logger.info(Connect4.strings.queued);
    }.bind(this));
    this.socket.on('player', function(player) {
      var player = new Connect4.Player(this, player);
      this.players.push(player);
      this.logger.info(Connect4.strings.connection, player.name());
    }.bind(this));

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
      // update the last move
      var slot = this.board.slots[move.row][move.col];
      if (this.lastMove)
        this.lastMove.unmark();
      this.lastMove = slot;
      // make move and log
      slot.move(player);
      slot.mark();
      this.alerts.update();
      this.logger.info('Opponent moved', player.name(), '@', move.row, move.col);

      // was this a winning move?
      if (move.win) {
        var ended = this.board.winner(player);
        if (!ended)
          this.logger.warn(Connect4.strings.mismatch);
        // notify user of defeat
        this.ended = true;
        this.logger.warn(Connect4.strings.defeat);
        this.logger.info(Connect4.strings.refresh);
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
      this.logger.warn(Connect4.strings.disconnection, player.name());
      // has the game already ended?
      if (this.ended) return;
      // did the game just end?
      if (data.winner) {
        this.ended = true;
        if (data.winner.id === this.user.id) {
          this.logger.impt(Connect4.strings.victory);
        } else {
          this.logger.warn(Connect4.strings.defeat);
        }
        this.logger.info(Connect4.strings.refresh);
      } else {
        // remaining players can still play
        // just update the current player (without changing the turn).
        this.logger.info(Connect4.strings.continue);
        this.current = this.players[this.turns % this.players.length];
      }
    }.bind(this));
  },

  start: function() {
    this.logger.impt(Connect4.strings.start);
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
      this.logger.impt(Connect4.strings.yourTurn);
    else
      this.logger.info(Connect4.strings.waiting);
  },

  move: function(row, col) {
    // players have not arrived yet
    if (!this.started || this.ended) return;
    // not this players move
    if (!this.current.is(this.user)) return;

    // general case
    var player = this.current;
    var slot = this.board.slots[row][col];
    if (slot.legal()) {
      // acknowledge the opponent's move
      if (this.lastMove)
        this.lastMove.unmark();
      // make move and log
      slot.move(player);
      this.logger.info('You moved', player.name(), '@', row, col);
      this.cursor.hide();
      // see if the game has ended
      this.ended = this.board.winner(this.current);
      this.socket.emit('move', { player_id: player.id, row: row, col: col, win: this.ended });
      if (this.ended) {
        this.logger.impt(Connect4.strings.victory);
        this.logger.info(Connect4.strings.refresh);
      } else
        this.next();
    } else
      this.logger.warn(Connect4.strings.invalid, '@', row, col);
  },


  //
  // Event handlers
  //

  update: function(dt) {  },

  scroll: function(event) {
    var delta = event.scrollDelta();
    this._changeView(delta.x * 0.005, delta.y);
  },

  mousedrag: function(event) {
    var delta = event.delta2D;
    this._changeView(delta.x * 0.005, delta.y);
  },

  mouseover: function(event) {
    this.cursor.hide();
  },


  //
  // Helper functions
  //

  _changeView: function(dtheta, dy) {
    this._rotate(dtheta);
    this._elevate(dy);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  },

  _elevate: function(dy) {
    var pos = this.camera.position;
    var y = pos.y - dy;
    // clamp the value
    pos.y = Math.max(500, Math.min(y, 1500));
  },

  _rotate: function(dtheta) {
    var pos = this.camera.position;
    var radius = Math.sqrt(pos.x*pos.x + pos.z*pos.z);
    var theta = Math.atan2(pos.z, pos.x) + dtheta;
    pos.x = Math.cos(theta) * radius;
    pos.z = Math.sin(theta) * radius;
  }
});
