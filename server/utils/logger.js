'use strict';

var config  = require('config');
var winston = require('winston');

module.exports = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ silent: !config.server.logs })
  ]
});
