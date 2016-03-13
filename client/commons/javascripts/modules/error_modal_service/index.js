import Angular           from 'angular';
import uibs              from 'angular-ui-bootstrap';
import ErrorModalService from './error_modal_service';

Angular
.module('error-modal-service', [ uibs ])
.service('errorModalService', ErrorModalService);

export default 'error-modal-service';
