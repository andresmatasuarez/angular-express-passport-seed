import _                     from 'lodash';
import Bluebird              from 'bluebird';
import mongoose              from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import Settings              from '../../settings';
import validations           from './validations';

const schema = new mongoose.Schema({
  email: {
    type      : String,
    lowercase : true
    // unique    : AdminErrors.email.unique,
  }
});

// passport-local-mongoose plugin
schema.plugin(passportLocalMongoose, {
  usernameField          : 'email',
  missingUsernameError   : Settings.Admin.errors.email.required,
  missingPasswordError   : Settings.Admin.errors.passwordMissing,
  userExistsError        : Settings.Admin.errors.email.unique,
  incorrectPasswordError : Settings.Admin.errors.incorrectPassword
});

schema.plugin(validations);

function transform(doc, ret) {
  return _.pick(ret, Settings.Admin.paths);
}

schema.set('toJSON',   { transform });
schema.set('toObject', { transform });

// Promisify passport-local-mongoose plugin statics
Bluebird.promisifyAll(schema.statics);
Bluebird.promisifyAll(schema.methods);

export default schema;
