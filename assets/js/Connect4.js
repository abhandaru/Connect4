// namespace
var Connect4 = { };

// system
Connect4.DEBUG = false;
Connect4.LOCAL = false;
Connect4.DOMAIN = 'fierce-bayou-5168.herokuapp.com'
Connect4.IP = (Connect4.LOCAL) ? 'localhost' : Connect4.DOMAIN;
Connect4.HOST = 'http://' + Connect4.IP;

// config
Connect4.SIZE = 100;
Connect4.ROWS = 5;
Connect4.COLS = 5;
Connect4.HEIGHT = 5;
Connect4.GOAL = 4;

// styling
Connect4.LIGHT = 0xAAAAAA;
Connect4.COLORS = [ 0x0000FF, 0xFF0000, 0x00FF00 ];
