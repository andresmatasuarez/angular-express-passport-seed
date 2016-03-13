import 'restangular';

import Angular from 'angular';
import API     from './api';

Angular
.module('api', [ 'restangular' ])
.service('API', API);

export default 'api';
