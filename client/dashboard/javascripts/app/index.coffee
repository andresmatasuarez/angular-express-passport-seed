'use strict'

require 'angular-animate'
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

# Commons
connectionRefusedInterceptor = require '../../../commons/javascripts/modules/connection_refused_interceptor'
errorModal                   = require '../../../commons/javascripts/modules/error_modal'
confirmationModal            = require '../../../commons/javascripts/modules/confirmation_modal'
authInterceptor              = require '../../../commons/javascripts/modules/auth_interceptor'

# Modules
api = require '../modules/api'

# Services
authService = require '../services/auth_service'

# Controllers
loginController         = require '../controllers/login_controller'
adminsListController    = require '../controllers/admins_list_controller'
adminsProfileController = require '../controllers/admins_profile_controller'

# Directives
navbar         = require '../directives/navbar'
compareToModel = require '../directives/compare_to_model'

# App
appRun    = require './app_run'
appConfig = require './app_config'

angular
.module 'dashboard', [
  'ui.router'
  'restangular'
  'ngAnimate'
  'ngStorage'
  'angular-loading-bar'
  'ngMessages'
  'ngTableAsync'
  'ncy-angular-breadcrumb'
  connectionRefusedInterceptor
  errorModal
  confirmationModal
  authInterceptor
  api
]

.controller 'LoginController',         loginController
.controller 'AdminsListController',    adminsListController
.controller 'AdminsProfileController', adminsProfileController

.factory    'AuthService',             authService
.directive  'navbar',                  navbar
.directive  'compareToModel',          compareToModel

.config appConfig
.run appRun

module.exports = 'dashboard'
