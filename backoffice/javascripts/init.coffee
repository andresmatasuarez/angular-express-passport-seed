# Great source on how to bootstrap an AngularJS app manually:
# https://blog.mariusschulz.com/2014/10/22/asynchronously-bootstrapping-angularjs-applications-with-server-side-data

angular.element(document).ready ->

  app          = angular.module 'dashboard'
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
