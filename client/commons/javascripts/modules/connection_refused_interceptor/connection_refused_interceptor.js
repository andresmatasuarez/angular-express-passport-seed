export default class ConnectionRefusedInterceptor {

  constructor($rootScope, $q) {
    this.$q         = $q;
    this.$rootScope = $rootScope;

    this.responseError = this.responseError.bind(this);
  }

  responseError(rejection) {
    if (rejection.status === -1) {
      this.$rootScope.$broadcast('connection_refused');
    }

    return this.$q.reject(rejection);
  }

}
