export default class AuthInterceptor {

  /* ngInject */
  constructor($rootScope, $q) {
    this.$q         = $q;
    this.$rootScope = $rootScope;

    this.responseError = this.responseError.bind(this);
  }

  responseError(rejection) {
    if (rejection.status === 401) {
      this.$rootScope.$broadcast('auth:unauthorized');
    }

    return this.$q.reject(rejection);
  }

}
