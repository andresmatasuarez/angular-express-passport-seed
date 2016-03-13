import Angular                      from 'angular';
import ConnectionRefusedInterceptor from './connection_refused_interceptor';

Angular
.module('connection-refused-interceptor', [])
.service('connectionRefusedInterceptor', ConnectionRefusedInterceptor)
.config(($httpProvider) => {
  $httpProvider.interceptors.push('connectionRefusedInterceptor');
});

export default 'connection-refused-interceptor';
