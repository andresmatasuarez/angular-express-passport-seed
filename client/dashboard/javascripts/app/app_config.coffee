'use strict'

templateLogin        = require '../../partials/_login.jade'
templateDashboard    = require '../../partials/_dashboard.jade'
templateHome         = require '../../partials/_home.jade'
templateBreadcrumbs  = require '../../partials/_breadcrumbs.jade'
templateUsersList    = require '../../partials/_users_list.jade'
templateUsersProfile = require '../../partials/_users_profile.jade'

resolveAuthenticationAndEmitIf = (eventToEmit, emitIfAuthenticated) ->
  # Manual dependency injection annotations, as ngAnnotate is having problems
  # detecting this, even with explicit comments
  [ '$rootScope', '$q', 'AuthService', ($rootScope, $q, AuthService) ->
    AuthService.ensureUserData()
    .then ->
      if emitIfAuthenticated
        $rootScope.$broadcast "auth:#{eventToEmit}"
        $q.reject()
    .catch ->
      if !emitIfAuthenticated
        $rootScope.$broadcast "auth:#{eventToEmit}"
        $q.reject() # Return a rejected promise so resolve does not 'resolves'
  ]

module.exports = ($locationProvider, $urlRouterProvider, $stateProvider, cfpLoadingBarProvider, $breadcrumbProvider) ->

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
    templateUrl : templateLogin
    controller  : 'LoginController'
    # resolve     :
    #   auth: resolveAuthenticationAndEmitIf 'already_logged', true

  $stateProvider.state 'dashboard',
    abstract      : true
    templateUrl   : templateDashboard
    # resolve       :
    #   auth: resolveAuthenticationAndEmitIf 'unauthorized', false
    ncyBreadcrumb :
      skip : true

  $stateProvider.state 'home',
    parent        : 'dashboard'
    url           : '/'
    templateUrl   : templateHome
    # resolve       :
    #   auth: resolveAuthenticationAndEmitIf 'unauthorized', false
    ncyBreadcrumb :
      label: 'Dashboard'

  $stateProvider.state 'users',
    parent        : 'dashboard'
    abstract      : true
    url           : '/users'
    templateUrl   : templateBreadcrumbs
    # resolve       :
    #   auth: resolveAuthenticationAndEmitIf 'unauthorized', false
    ncyBreadcrumb :
      skip: true

  $stateProvider.state 'users.list',
    url           : '/list'
    templateUrl   : templateUsersList
    controller    : 'UsersListController'
    # resolve       :
    #   auth: resolveAuthenticationAndEmitIf 'unauthorized', false
    ncyBreadcrumb :
      label: 'Users'

  $stateProvider.state 'users.add',
    url           : '/add'
    templateUrl   : templateUsersProfile
    controller    : 'UsersProfileController'
    resolve       :
      # auth: resolveAuthenticationAndEmitIf 'unauthorized', false
      user: -> undefined
    ncyBreadcrumb :
      parent : 'users.list'
      label  : 'New'

  $stateProvider.state 'users.edit',
    url           : '/edit/:id'
    templateUrl   : templateUsersProfile
    controller    : 'UsersProfileController'
    resolve       :
      # auth: resolveAuthenticationAndEmitIf 'unauthorized', false
      user: ($stateParams, API) -> API.users.get($stateParams.id)
    ncyBreadcrumb :
      parent : 'users.list'
      label  : 'Edit'
