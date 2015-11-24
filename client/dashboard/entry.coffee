'use strict'

require './stylesheets/app.less'

angular      = require 'angular'
mainTemplate = require './main.jade'
dashboard    = require './javascripts/app'

# Great source on how to bootstrap an AngularJS app manually:
# https://blog.mariusschulz.com/2014/10/22/asynchronously-bootstrapping-angularjs-applications-with-server-side-data
angular.element(document).ready ->
  initInjector = angular.injector [ 'ng' ]
  $http        = initInjector.get '$http'

  dashboardModule = angular.module dashboard

  # Fetch settings
  $http.get '/api/settings'
  .then (res) ->
    dashboardModule.constant 'Settings', res.data

    # Prepend main template to body
    document.body.innerHTML = mainTemplate + document.body.innerHTML

    # Bootstrap app
    angular.bootstrap document, [ dashboard ]

  # TODO handle error.
  .catch (err) -> console.error err
