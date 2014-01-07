Connect4.Logger = Game3.Class.extend({

  init: function() {
    // create container
    var el = document.createElement('div');
    el.className = 'logger';
    this.el = el;
  },

  gogo: function() {
    var line = this._line(arguments, 'gogo');
    this._add(line);
  },

  info: function() {
    var line = this._line(arguments, 'info');
    this._add(line);
  },

  warn: function() {
    var line = this._line(arguments, 'warn');
    this._add(line);
  },

  log: function() {
    var line = this._line(arguments);
    this._add(line);
  },


  //
  // Private helpers
  //

  _add: function(line) {
    this.el.appendChild(line);
    this._scroll();
  },

  _line: function(args, type) {
    var message = this._join(args);
    var classes = ['message'];
    // create a container
    var line = document.createElement('div');
    // add metadata
    if (type !== undefined)
      classes.push(type);
    line.className = classes.join(' ');
    // set content
    line.innerHTML = message;
    return line;
  },

  _join: function(args) {
    var array =  Array.prototype.slice.apply(args);
    var message = array.join(' ');
    return message;
  },

  _scroll: function() {
    this.el.scrollTop = this.el.scrollHeight;
  }


});
