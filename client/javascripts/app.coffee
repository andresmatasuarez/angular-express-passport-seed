'use strict'

app = angular.module 'web', []

app.config ($locationProvider) ->
  $locationProvider.html5Mode true

app.run()
