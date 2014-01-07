// export the lib
var user = { };
module.exports = exports = user;


//
// Constructor
//

user.User = function(id, order, socket) {
  this.id = id;
  this.order = order;
  this.socket = socket;
  this.game = null;
};


//
// Instance methods
//

user.User.prototype = {

  json: function() {
    return {
      id: this.id,
    };
  }

};
