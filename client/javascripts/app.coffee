'use strict'

angular = require 'angular'

app = angular.module 'web', []

app.config ($locationProvider) ->
  $locationProvider.html5Mode true
  $locationProvider.hashPrefix '!'

app.run()

module.exports = app
