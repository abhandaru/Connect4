// export namespace
var config = { };
module.exports = exports = config;

// env
config.debug = '-debug' in process.argv;
config.production = process.env.NODE_ENV === 'production';

// ports
config.devPort = 3000;
config.prodPort = process.env.PORT || config.devPort;
config.port = (config.production) ? config.prodPort : config.devPort;
