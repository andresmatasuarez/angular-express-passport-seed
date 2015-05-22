'use strict';

var Environments = require('./environments');

module.exports = {
  env: Environments.production,
  mongo: {
    options: {
      db: {
        safe: true
      }
    },
    uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI
  }
};
