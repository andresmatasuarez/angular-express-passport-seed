'use strict';

require('../run');

var config = require('config');
var Log    = require('../utils/log');
var App    = require('../app');

App.setup()
.then(function(){

  App.server.http.listen(config.server.port, function(){
    Log.info('HTTP server listening on port ' + config.server.port);
  });

  if (config.env !== config.environments.production){
    App.server.https.listen(config.server.ssl.port, function(){
      Log.info('HTTPS server listening on port ' + config.server.ssl.port);
    });
  }

});
