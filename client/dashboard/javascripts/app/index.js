import 'angular-animate';
import 'angular-breadcrumb';
import 'angular-messages';
import 'angular-ui-router';
import 'ngstorage';
import 'restangular';
import 'angular-loading-bar';

// Fix this ugly bit of code
import 'ng-table-async/node_modules/ng-table/dist/ng-table';
import 'ng-table-async';

import Angular from 'angular';

// Commons
import connectionRefusedInterceptor from '../../../commons/javascripts/modules/connection_refused_interceptor';
import errorModalService            from '../../../commons/javascripts/modules/error_modal_service';
import confirmationModalService     from '../../../commons/javascripts/modules/confirmation_modal_service';
import authInterceptor              from '../../../commons/javascripts/modules/auth_interceptor';

// Modules
import api from '../modules/api';

// Services
import authService from '../services/auth_service';

// Controllers
import loginController         from '../controllers/login_controller';
import adminsListController    from '../controllers/admins_list_controller';
import adminsProfileController from '../controllers/admins_profile_controller';

// Directives
import navbar         from '../directives/navbar';
import compareToModel from '../directives/compare_to_model';

// App
import appRun    from './app_run';
import appConfig from './app_config';

Angular
.module('dashboard', [
  'ui.router',
  'restangular',
  'ngAnimate',
  'ngStorage',
  'angular-loading-bar',
  'ngMessages',
  'ngTableAsync',
  'ncy-angular-breadcrumb',
  connectionRefusedInterceptor,
  errorModalService,
  confirmationModalService,
  authInterceptor,
  api
])
.controller('LoginController', loginController)
.controller('AdminsListController', adminsListController)
.controller('AdminsProfileController', adminsProfileController)
.service('AuthService', authService)
.directive('navbar', navbar)
.directive('compareToModel', compareToModel)
.config(appConfig)
.run(appRun);

export default 'dashboard';
