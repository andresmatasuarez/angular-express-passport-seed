import templateLogin         from '../../partials/_login.jade';
import templateDashboard     from '../../partials/_dashboard.jade';
import templateHome          from '../../partials/_home.jade';
import templateBreadcrumbs   from '../../partials/_breadcrumbs.jade';
import templateAdminsList    from '../../partials/_admins_list.jade';
import templateAdminsProfile from '../../partials/_admins_profile.jade';

function resolveAuthenticationAndEmitIf(eventToEmit, emitIfAuthenticated) {
  // Manual dependency injection annotations, as ngAnnotate is having problems
  // detecting this, even with explicit comments
  return [ '$rootScope', '$q', 'AuthService', ($rootScope, $q, AuthService) => {
    return AuthService.ensureAdminData()
    .then(() => {
      if (emitIfAuthenticated) {
        $rootScope.$broadcast("auth:#{eventToEmit}");
        return $q.reject();
      }
    })
    .catch((err) => {
      if (!emitIfAuthenticated) {
        $rootScope.$broadcast("auth:#{eventToEmit}");

        // Return a rejected promise so resolve does not 'resolves'
        return $q.reject();
      }
    });
  }];
}

export default function appConfig(
  $locationProvider, $urlRouterProvider, $stateProvider,
  cfpLoadingBarProvider, $breadcrumbProvider
) {

  $locationProvider.html5Mode(true);
  $locationProvider.hashPrefix('!');

  cfpLoadingBarProvider.includeSpinner   = false;
  cfpLoadingBarProvider.latencyThreshold = 1;

  $breadcrumbProvider.setOptions({
    prefixStateName : 'home',
    includeAbstract : true
  });

  $urlRouterProvider.otherwise('/');

  $stateProvider.state('login', {
    url         : '/login',
    templateUrl : templateLogin,
    controller  : 'LoginController'
    // resolve: { auth: resolveAuthenticationAndEmitIf('already_logged', true) }
  });

  $stateProvider.state('dashboard', {
    abstract    : true,
    templateUrl : templateDashboard,
    // resolve : { auth: resolveAuthenticationAndEmitIf('unauthorized', false) }
    ncyBreadcrumb: { skip: true }
  });

  $stateProvider.state('home', {
    parent      : 'dashboard',
    url         : '/',
    templateUrl : templateHome,
    // resolve : { auth: resolveAuthenticationAndEmitIf('unauthorized', false) }
    ncyBreadcrumb: { label: 'Dashboard' }
  });

  $stateProvider.state('admins', {
    parent        : 'dashboard',
    abstract      : true,
    url           : '/admins',
    templateUrl   : templateBreadcrumbs,
    // resolve : { auth: resolveAuthenticationAndEmitIf('unauthorized', false) }
    ncyBreadcrumb: { skip: true }
  });

  $stateProvider.state('admins.list', {
    url           : '/list',
    templateUrl   : templateAdminsList,
    controller    : 'AdminsListController',
    // resolve : { auth: resolveAuthenticationAndEmitIf('unauthorized', false) }
    ncyBreadcrumb: { label: 'Admins' }
  });

  $stateProvider.state('admins.add', {
    url         : '/add',
    templateUrl : templateAdminsProfile,
    controller  : 'AdminsProfileController',
    resolve     : {
      // auth: resolveAuthenticationAndEmitIf('unauthorized', false)
      admin: () => undefined
    },
    ncyBreadcrumb: {
      parent : 'admins.list',
      label  : 'New'
    }
  });

  $stateProvider.state('admins.edit', {
    url         : '/edit/:id',
    templateUrl : templateAdminsProfile,
    controller  : 'AdminsProfileController',
    resolve     : {
      // auth: resolveAuthenticationAndEmitIf('unauthorized', false)
      admin: ($stateParams, API) => API.admins.get($stateParams.id)
    },
    ncyBreadcrumb : {
      parent : 'admins.list',
      label  : 'Edit'
    }
  });
}
