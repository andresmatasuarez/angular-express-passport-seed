'use strict'

angular = require 'angular'

angular
.module 'web', []
.config ($locationProvider) ->
  $locationProvider.html5Mode true
  $locationProvider.hashPrefix '!'

.run()

module.exports = 'web'
