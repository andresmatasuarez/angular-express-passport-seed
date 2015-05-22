'use strict'

app = angular.module 'dashboard', [
  'ui.router'
  'ui.bootstrap'
  'restangular'
  'ngStorage'
  'angular-loading-bar'
  'ngAnimate'
  'ngMessages'
  'ngTable'
  'ncy-angular-breadcrumb'
]

app.config ($locationProvider, $urlRouterProvider, $stateProvider, cfpLoadingBarProvider, $breadcrumbProvider) ->

  $locationProvider.html5Mode true
  $locationProvider.hashPrefix '!'

  cfpLoadingBarProvider.includeSpinner = false
  cfpLoadingBarProvider.latencyThreshold = 1

  $breadcrumbProvider.setOptions
    prefixStateName : 'home'
    includeAbstract : true

  $urlRouterProvider.otherwise '/'

  $stateProvider.state 'auth',
    abstract      : true
    template      : '<div ui-view></div>'
    resolve       :
      auth: (AuthService) -> AuthService.isAuthenticated()
    ncyBreadcrumb :
      skip : true

  $stateProvider.state 'login',
    url         : '/login'
    templateUrl : 'partials/_login.html'
    controller  : 'LoginController'
    resolve     :
      alreadyLogged: (AuthService, $q, $sessionStorage) ->
        AuthService.isAuthenticated()
        .finally ->
          if _.isEmpty $sessionStorage.user
            $q.when()
          else
            $q.reject
              alreadyLogged: true

  $stateProvider.state 'home',
    parent        : 'auth'
    url           : '/'
    templateUrl   : 'partials/_home.html'
    ncyBreadcrumb :
      label: 'Dashboard'

  $stateProvider.state 'users',
    parent        : 'auth'
    abstract      : true
    url           : '/users'
    templateUrl   : 'partials/_breadcrumbs.html'
    ncyBreadcrumb :
      skip: true

  $stateProvider.state 'users.list',
    url           : '/list'
    templateUrl   : 'partials/_users_list.html'
    controller    : 'UsersListController'
    ncyBreadcrumb :
      label: 'Users'

  $stateProvider.state 'users.add',
    url           : '/add'
    templateUrl   : 'partials/_users_profile.html'
    controller    : 'UsersProfileController'
    resolve       :
      user: -> undefined
    ncyBreadcrumb :
      parent : 'users.list'
      label  : 'New'

  $stateProvider.state 'users.edit',
    url           : '/edit/:id'
    templateUrl   : 'partials/_users_profile.html'
    controller    : 'UsersProfileController'
    resolve       :
      user: ($stateParams, API) -> API.users.get($stateParams.id)
    ncyBreadcrumb :
      parent : 'users.list'
      label  : 'Edit'

app.run ($rootScope, $state) ->

  # State utils
  $rootScope.isState = (name) ->
    $state.is name

  $rootScope.goBack = ->
    prev = $rootScope.previousState
    $state.go if _.isEmpty prev then 'home' else prev

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

  $rootScope.$on '$stateChangeError', (event, toState, toParams, fromState, fromParams, error) ->
    if error.status == 401
      event.preventDefault()
      $state.go 'login'

    else if error.alreadyLogged
      event.preventDefault()
      $state.go 'home'

  # Keep track of previous and current states.
  $rootScope.$on '$stateChangeSuccess', (ev, to, toParams, from, fromParams) ->
    $rootScope.previousState = from.name
    $rootScope.currentState  = to.name
