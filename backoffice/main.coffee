'use strict'

require 'bootstrap/less/bootstrap.less'
require 'font-awesome/less/font-awesome.less'
require './stylesheets/app.less'

angular   = require 'angular'
Dashboard = require './javascripts/app'

# Great source on how to bootstrap an AngularJS app manually:
# https://blog.mariusschulz.com/2014/10/22/asynchronously-bootstrapping-angularjs-applications-with-server-side-data
angular.element(document).ready ->

  app          = angular.module Dashboard
  console.log(-1, app);
  initInjector = angular.injector [ 'ng' ]
  $http        = initInjector.get '$http'

  # Fetch config data
  $http.get '/api/settings'

  # Include data in app
  .then (res) -> app.constant 'Settings', res.data

  # Bootstrap app.
  .then -> angular.bootstrap document, [ 'dashboard' ]

  # TODO handle error.
  .catch (err) -> console.error err
