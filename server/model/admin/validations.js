import validator from 'validator';
import Settings  from '../../settings';

export default function validations(schema) {
  schema.path('email').required(true, Settings.Admin.errors.email.required);
  schema.path('email').validate(validator.isEmail, Settings.Admin.errors.email.invalid);
}
