Connect4.Alerts = Game3.Class.extend({

  init: function() {
    this.original = document.title;
    this.count = 0;
    this.active = false;

    // resolve and bind events
    this._setupEvents();
  },

  update: function() {
    if (!this.active) return;
    // we are not in focus
    this.count++;
    var title = this.original + ' (' + this.count + ')';
    document.title = title;
  },

  clear: function() {
    this.count = 0;
    document.title = this.original;
  },


  //
  // Private helpers
  //

  _setupEvents: function() {
    var prefix;
    if (document.hidden !== undefined)
      prefix = '';
    else if (document.mozHidden !== undefined)
      prefix = 'moz';
    else if (document.msHidden !== undefined)
      prefix = 'ms';
    else if (document.webkitHidden !== undefined)
      prefix = 'webkit';
    // no support
    else
      return;

    // determine attribute names
    this._hiddenAttr = (prefix.length) ? prefix + 'Hidden' : 'hidden';
    var change = prefix + 'visibilitychange';

    // bind the event
    document.addEventListener(change, this._change.bind(this), false);
  },

  _change: function(event) {
    var hidden = document[this._hiddenAttr];
    this.active = hidden;
    // hide notifications if page is visible
    if (!hidden)
      this.clear();
  }

});
