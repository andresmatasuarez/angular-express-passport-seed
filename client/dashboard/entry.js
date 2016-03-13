import './stylesheets/app.less';

import Angular      from 'angular';
import mainTemplate from './main.jade';
import dashboard    from './javascripts/app';

// Great source on how to bootstrap an AngularJS app manually:
// https://blog.mariusschulz.com/2014/10/22/asynchronously-bootstrapping-angularjs-applications-with-server-side-data
Angular.element(document).ready(() => {
  const initInjector = Angular.injector([ 'ng' ]);
  const $http        = initInjector.get('$http');

  const dashboardModule = Angular.module(dashboard);

  // Fetch settings
  $http.get('/api/settings')
  .then((res) => {
    dashboardModule.constant('Settings', res.data);

    // Prepend main template to body
    document.body.innerHTML = mainTemplate + document.body.innerHTML;

    // Bootstrap app
    Angular.bootstrap(document, [ dashboard ]);
  })
  .catch((err) => {
    // TODO better error handling
    console.error(err);
  });
});

