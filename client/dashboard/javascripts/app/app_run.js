import _ from 'lodash';

export default function appRun($rootScope, $state, AuthService, $templateCache, errorModalService) {

  // Initial check of authentication
  AuthService.ensureAdminData().catch(() => {
    AuthService.deleteAdminData();
    $state.go('login');
  });

  // State utils
  $rootScope.goBack = () => {
    const prev    = $rootScope.previousState;
    const current = $rootScope.currentState;

    // If previous state is defined, then go to previous state
    if (prev && prev.state && prev.state.name) {
      $state.go(prev.state.name, prev.params);

    // If not, deduce parent state from ncyBreadcrumb if that information is available
    } else if (current.state && current.state.ncyBreadcrumb && current.state.ncyBreadcrumb.parent) {
      $state.go(current.state.ncyBreadcrumb.parent, current.params);

    // Else, go to 'home'
    } else {
      $state.go('home');
    }
  };

  $rootScope.goToNextState = () => {
    const next = $rootScope.nextState;

    if (next && next.state && next.state.name) {
      $state.go(next.state.name, next.params);
    } else {
      $state.go('home');
    }
  };

  // Form utils
  $rootScope.extendForm = (form) => {
    form.hasError = (fieldName) => form[fieldName].$dirty && form[fieldName].$invalid;
  };

  // Error utils
  $rootScope.cleanResponseErrors = (err) => {
    if (_.isString(err)) {
      return [ err ];
    } else if (_.isEmpty(err.data) || _.isEmpty(err.data.message)) {
      if (_.isArray(err.data)) {
        return err.data;
      }
      return [ err.data ];
    }
    return [ err.data.message ];
  };

  $rootScope.$on('auth:unauthorized', () => {
    AuthService.deleteAdminData();
    $state.go('login');
  });

  $rootScope.$on('auth:already_logged', () => {
    $state.go('home');
  });

  $rootScope.$on('connection_refused', () => {
    errorModalService.open('Connection refused by server', -1);
  });

  // Keep track of previous and current states.
  $rootScope.$on('$stateChangeSuccess', (ev, to, toParams, from, fromParams) => {
    $rootScope.previousState = {
      state  : from,
      params : fromParams
    };

    $rootScope.currentState = {
      state  : to,
      params : toParams
    };

    $rootScope.nextState = undefined;
  });

  // Keep track of every state change
  $rootScope.$on('$stateChangeStart', (ev, to, toParams) => {
    if (to.name !== 'login') {
      $rootScope.nextState = {
        state  : to,
        params : toParams
      };
    }
  });

  // TODO improve client-side error handling
  $rootScope.$on('$stateChangeError', (ev, to, toParams, from, fromParams, error) => {
    console.log('changeError', error, to, from);
  });
}
