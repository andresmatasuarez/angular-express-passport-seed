'use strict';

var Environments = require('./environments');

module.exports = {
  env: Environments.production,
  server: {
    session_secret : process.env.SESSION_SECRET
  },
  mongo: {
    options: {
      db: {
        safe: true
      }
    },
    uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI
  }
};
