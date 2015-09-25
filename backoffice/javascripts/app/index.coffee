'use strict'

require 'expose?_!lodash'
require 'expose?angular!angular'

require 'angular-bootstrap'
require 'angular-breadcrumb'
require 'angular-messages'
require 'angular-ui-router'
require 'ngstorage'
require 'restangular'
require 'angular-loading-bar'

# Fix this ugly bit of code
require 'ng-table-async/node_modules/ng-table/dist/ng-table'
require 'ng-table-async'

authInterceptor = require '../modules/auth_interceptor'
api             = require '../modules/api'

angular = require 'angular'

app = angular.module 'dashboard', [
  'ui.router'
  'ui.bootstrap'
  'restangular'
  'ngStorage'
  'angular-loading-bar'
  'ngMessages'
  'ngTableAsync'
  'ncy-angular-breadcrumb'
  authInterceptor
  api
]

# Services
authService = require '../services/auth_service'

# Controllers
loginController        = require '../controllers/login_controller'
usersListController    = require '../controllers/users_list_controller'
usersProfileController = require '../controllers/users_profile_controller'

app.controller 'LoginController',        loginController
app.controller 'UsersProfileController', usersListController
app.controller 'UsersProfileController', usersProfileController

app.factory 'AuthService', authService

appRun    = require './app_run'
appConfig = require './app_config'

app.config appConfig
app.run appRun

module.exports = 'dashboard'
