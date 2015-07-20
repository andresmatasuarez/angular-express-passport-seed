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

require './modules/auth_interceptor'

angular = require 'angular'

module.exports = 'dashboard'

app = angular.module 'dashboard', [
  'ui.router'
  'ui.bootstrap'
  'restangular'
  'ngStorage'
  'angular-loading-bar'
  'ngMessages'
  'ngTableAsync'
  'ncy-angular-breadcrumb'
  'auth-interceptor'
]

require './services/auth_service'
require './services/api'

resolveAuthenticationAndEmitIf = (eventToEmit, emitIfAuthenticated) ->
  # Manual dependency injection annotations, as ngAnnotate is having problems
  # detecting this, even with explicit comments
  [ '$rootScope', '$q', 'AuthService', ($rootScope, $q, AuthService) ->
    AuthService.isAuthenticated()
    .then (authenticated) ->
      if authenticated == emitIfAuthenticated
        $rootScope.$broadcast "auth:#{eventToEmit}"
        $q.reject()
  ]

app.config ($locationProvider, $urlRouterProvider, $stateProvider, cfpLoadingBarProvider, $breadcrumbProvider, $httpProvider) ->

  $httpProvider.interceptors.push 'AuthInterceptor'

  $locationProvider.html5Mode true
  $locationProvider.hashPrefix '!'

  cfpLoadingBarProvider.includeSpinner   = false
  cfpLoadingBarProvider.latencyThreshold = 1

  $breadcrumbProvider.setOptions
    prefixStateName : 'home'
    includeAbstract : true

  $urlRouterProvider.otherwise '/'

  $stateProvider.state 'login',
    url         : '/login'
    templateUrl : require '../partials/_login.jade'
    controller  : 'LoginController'
    resolve     :
      auth: resolveAuthenticationAndEmitIf 'alreadylogged', true

  $stateProvider.state 'dashboard',
    abstract      : true
    templateUrl   : require '../partials/_dashboard.jade'
    resolve       :
      auth: resolveAuthenticationAndEmitIf 'unauthorized', false
    ncyBreadcrumb :
      skip : true

  $stateProvider.state 'home',
    parent        : 'dashboard'
    url           : '/'
    templateUrl   : require '../partials/_home.jade'
    resolve       :
      auth: resolveAuthenticationAndEmitIf 'unauthorized', false
    ncyBreadcrumb :
      label: 'Dashboard'

  $stateProvider.state 'users',
    parent        : 'dashboard'
    abstract      : true
    url           : '/users'
    templateUrl   : require '../partials/_breadcrumbs.jade'
    resolve       :
      auth: resolveAuthenticationAndEmitIf 'unauthorized', false
    ncyBreadcrumb :
      skip: true

  $stateProvider.state 'users.list',
    url           : '/list'
    templateUrl   : require '../partials/_users_list.jade'
    controller    : 'UsersListController'
    resolve       :
      auth: resolveAuthenticationAndEmitIf 'unauthorized', false
    ncyBreadcrumb :
      label: 'Users'

  $stateProvider.state 'users.add',
    url           : '/add'
    templateUrl   : require '../partials/_users_profile.jade'
    controller    : 'UsersProfileController'
    resolve       :
      auth: resolveAuthenticationAndEmitIf 'unauthorized', false
      user: -> undefined
    ncyBreadcrumb :
      parent : 'users.list'
      label  : 'New'

  $stateProvider.state 'users.edit',
    url           : '/edit/:id'
    templateUrl   : require '../partials/_users_profile.jade'
    controller    : 'UsersProfileController'
    resolve       :
      auth: resolveAuthenticationAndEmitIf 'unauthorized', false
      user: ($stateParams, API) -> API.users.get($stateParams.id)
    ncyBreadcrumb :
      parent : 'users.list'
      label  : 'Edit'

app.run ($rootScope, $state, AuthService, $templateCache) ->

  console.log($templateCache.get('partials/_login.jade'));
  console.log(require('../partials/_login.jade'));
  console.log(0, app);

  # State utils
  $rootScope.isState = (name) -> $state.is name

  $rootScope.goBack = ->
    prev = $rootScope.previousState

    if prev
      $state.go prev.name, prev.params
    else
      $state.go 'home'

  $rootScope.goToNextState = ->
    next = $rootScope.nextState

    if next
      $state.go next.name, next.params
    else
      $state.go 'home'

  # Form utils
  $rootScope.extendForm = (form) ->
    form.hasError = (fieldName) ->
      form[fieldName].$dirty && form[fieldName].$invalid

  # Error utils
  $rootScope.cleanResponseErrors = (err) ->
    if _.isString err
      [ err ]
    else if _.isUndefined(err.data) || _.isUndefined(err.data.message)
      if _.isArray err.data then err.data else [ err.data ]
    else
      [ err.data.message ]

  $rootScope.$on 'auth:unauthorized', (msg, data) ->
    AuthService.deleteUserData()
    $state.go 'login'

  $rootScope.$on 'auth:alreadylogged', (msg, data) ->
    prev = $rootScope.previousState
    $state.go 'home'

  # Keep track of previous and current states.
  $rootScope.$on '$stateChangeSuccess', (ev, to, toParams, from, fromParams) ->
    $rootScope.previousState =
      name   : from.name
      params : fromParams

    $rootScope.currentState =
      name   : to.name
      params : toParams

  # Keep track of every state change
  $rootScope.$on '$stateChangeStart', (ev, to, toParams, from, fromParams) ->
    if to.name != 'login'
      $rootScope.nextState =
        name   : to.name
        params : toParams

  # TODO improve client-side error handling
  $rootScope.$on '$stateChangeError', (ev, to, toParams, from, fromParams, error) ->
    console.log('changeError', error, to, from);
