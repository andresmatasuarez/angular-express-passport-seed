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
  initInjector = angular.injector [ 'ng' ]
  $http        = initInjector.get '$http'

  # Fetch config data
  $http.get '/api/settings'

  # Include data in app
  .then (res) -> app.constant 'Settings', res.data

  # Bootstrap app.
  .then ->

    document.body.innerHTML += """
      <div class="main" ng-class="{ 'login-body': isState('login') }">
        <div class="row" ui-view>
        </div>
      </div>
    """

    angular.bootstrap document, [ 'dashboard' ]

  # TODO handle error.
  .catch (err) -> console.error err
