'use strict'

templateLogin         = require '../../partials/_login.jade'
templateDashboard     = require '../../partials/_dashboard.jade'
templateHome          = require '../../partials/_home.jade'
templateBreadcrumbs   = require '../../partials/_breadcrumbs.jade'
templateAdminsList    = require '../../partials/_admins_list.jade'
templateAdminsProfile = require '../../partials/_admins_profile.jade'

resolveAuthenticationAndEmitIf = (eventToEmit, emitIfAuthenticated) ->
  # Manual dependency injection annotations, as ngAnnotate is having problems
  # detecting this, even with explicit comments
  [ '$rootScope', '$q', 'AuthService', ($rootScope, $q, AuthService) ->
    AuthService.ensureAdminData()
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

  $stateProvider.state 'admins',
    parent        : 'dashboard'
    abstract      : true
    url           : '/admins'
    templateUrl   : templateBreadcrumbs
    # resolve       :
    #   auth: resolveAuthenticationAndEmitIf 'unauthorized', false
    ncyBreadcrumb :
      skip: true

  $stateProvider.state 'admins.list',
    url           : '/list'
    templateUrl   : templateAdminsList
    controller    : 'AdminsListController'
    # resolve       :
    #   auth: resolveAuthenticationAndEmitIf 'unauthorized', false
    ncyBreadcrumb :
      label: 'Admins'

  $stateProvider.state 'admins.add',
    url           : '/add'
    templateUrl   : templateAdminsProfile
    controller    : 'AdminsProfileController'
    resolve       :
      # auth: resolveAuthenticationAndEmitIf 'unauthorized', false
      admin: -> undefined
    ncyBreadcrumb :
      parent : 'admins.list'
      label  : 'New'

  $stateProvider.state 'admins.edit',
    url           : '/edit/:id'
    templateUrl   : templateAdminsProfile
    controller    : 'AdminsProfileController'
    resolve       :
      # auth: resolveAuthenticationAndEmitIf 'unauthorized', false
      admin: ($stateParams, API) -> API.admins.get($stateParams.id)
    ncyBreadcrumb :
      parent : 'admins.list'
      label  : 'Edit'
