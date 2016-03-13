import Angular                  from 'angular';
import uibs                     from 'angular-ui-bootstrap';
import ConfirmationModalService from './confirmation_modal_service';

Angular
.module('confirmation-modal-service', [ uibs ])
.service('confirmationModalService', ConfirmationModalService);

export default 'confirmation-modal-service';
