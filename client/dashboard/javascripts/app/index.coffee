'use strict'

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

angular = require 'angular'

# Modules
authInterceptor              = require '../modules/auth_interceptor'
connectionRefusedInterceptor = require '../modules/connection_refused_interceptor'
api                          = require '../modules/api'

# Services
authService = require '../services/auth_service'

# Controllers
loginController        = require '../controllers/login_controller'
usersListController    = require '../controllers/users_list_controller'
usersProfileController = require '../controllers/users_profile_controller'

# Directives
navbar         = require '../directives/navbar'
compareToModel = require '../directives/compare_to_model'

# App
appRun    = require './app_run'
appConfig = require './app_config'

angular
.module 'dashboard', [
  'ui.router'
  'ui.bootstrap'
  'restangular'
  'ngStorage'
  'angular-loading-bar'
  'ngMessages'
  'ngTableAsync'
  'ncy-angular-breadcrumb'
  authInterceptor
  connectionRefusedInterceptor
  api
]
.controller 'LoginController',        loginController
.controller 'UsersListController',    usersListController
.controller 'UsersProfileController', usersProfileController
.factory    'AuthService',            authService
.directive  'navbar',                 navbar
.directive  'compareToModel',         compareToModel

.config appConfig
.run appRun

module.exports = 'dashboard'
