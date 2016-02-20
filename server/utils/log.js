'use strict';

const config  = require('config');
const winston = require('winston');

module.exports = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ silent: !config.server.logs })
  ]
});
