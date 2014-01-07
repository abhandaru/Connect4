// export the lib
var util = { };
module.exports = exports = util;

//
// Map implementation
//

util.Map = function() {
  this.clear();
};

util.Map.prototype = {

  clear: function() {
    this._size = 0;
    this._data = { };
  },


  contains: function(key) {
    var hash = this._hash(key);
    return (this._data[hash] !== undefined);
  },


  get: function(key) {
    var hash = this._hash(key);
    var pair = this._data[hash];
    return pair && pair[1];
  },


  put: function(key, value) {
    var hash = this._hash(key);
    if (!this.contains(key))
      this._size++;
    // store key-value pair
    this._data[hash] = [key, value];
  },


  remove: function(key) {
    var hash = this._hash(key);
    var old = this._data[hash][1];
    delete this._data[hash];
    this._size--;
    return old;
  },


  size: function() {
    return this._size;
  },


  forEach: function(callback, bind) {
    bind = (bind !== undefined) ? bind : this;
    for (hash in this._data) {
      var pair = this._data[hash];
      callback.apply(bind, pair);
    }
  },


  _hash: function(key) {
    return (typeof key.hash == 'function') ? key.hash() : key.toString();
  }

};

