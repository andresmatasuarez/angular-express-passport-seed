import Angular         from 'angular';
import AuthInterceptor from './auth_interceptor';

Angular
.module('auth-interceptor', [])
.service('authInterceptor', AuthInterceptor)
.config(($httpProvider) => {
  $httpProvider.interceptors.push('authInterceptor');
});

export default 'auth-interceptor';
