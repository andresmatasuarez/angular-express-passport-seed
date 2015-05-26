'use strict';

var url          = require('url');
var Environments = require('./environments');

module.exports = {
  env: Environments.production,
  server: {
    token_secret: process.env.TOKEN_SECRET
  },
  mongo: {
    options: {
      db: {
        safe: true
      }
    },
    uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI
  },
  redis: {
    host : url.parse(process.env.REDISTOGO_URL).host,
    port : url.parse(process.env.REDISTOGO_URL).port,
    pass : url.parse(process.env.REDISTOGO_URL).auth.split(':')[1]
  }
};
