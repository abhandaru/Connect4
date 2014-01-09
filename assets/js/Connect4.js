// namespace
var Connect4 = { };

// connection
Connect4.DEBUG = false;
Connect4.DOMAIN = 'connect3d.herokuapp.com'
Connect4.HOST = window.location;

// config
Connect4.SIZE = 100;
Connect4.ROWS = 5;
Connect4.COLS = 5;
Connect4.HEIGHT = 5;
Connect4.GOAL = 4;

// styling
Connect4.colors = [ 0x5555FF, 0xFF5555, 0x55FF55 ];
Connect4.highlights = [ 0xAAAAFF, 0xFF8888, 0xAAFFAA ];

// strings
Connect4.strings = {
  connection:    'Player connected',
  continue:      'Continuing play ...',
  defeat:        '<b>Defeat!</b>',
  disconnection: 'Opponent disconnected',
  invalid:       'Invalid move',
  mismatch:      'Board states disagree.',
  queued:        'Waiting in queue ...',
  refresh:       'Refresh to play again.',
  start:         '<b>Start game!</b>',
  victory:       '<b>You are victorious!</b>',
  waiting:       'Waiting for opponent ...',
  welcome:       '<b>Welcome to Connect3d!</b>',
  yourTurn:      'Your move!'
};
