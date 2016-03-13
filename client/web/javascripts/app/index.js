import Angular from 'angular';

Angular
.module('web', [])
.config(($locationProvider) => {
  $locationProvider.html5Mode(true);
  $locationProvider.hashPrefix('!');
})
.run();

export default 'web';
