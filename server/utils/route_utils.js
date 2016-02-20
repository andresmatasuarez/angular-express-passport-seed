/** @module RouteUtils */

'use strict';

const _         = require('lodash');
const util      = require('util');
const mongoose  = require('mongoose');
const Bluebird  = require('bluebird');

function InvalidIdError(message, extra) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.extra = extra;
}

function DocumentNotFoundError(message, extra) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.extra = extra;
}

function ForbiddenError(message, extra) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.extra = extra;
}

util.inherits(InvalidIdError, Error);
util.inherits(DocumentNotFoundError, Error);
util.inherits(ForbiddenError, Error);

module.exports = {

  InvalidIdError,
  DocumentNotFoundError,
  ForbiddenError,

  /**
   * validateId
   * @desc Returns a middleware that checks the validity of a MongoDB's ObjectId param.
   * @param {object} options - Options.
   * @param {string} [options.param='id'] The name of the request param that holds the ID.
   * @param {string} [options.error='Invalid ID'] Error message to display in case of invalid ID.
   * @param {function} [options.callback(req, res, next, error)=Sends a Bad Request response with error message] - Callback that is called in case of invalid ID.
   * @returns If ID is invalid, options.callback is called with error message. Else, control is passed to the next middleware.
   */
  validateId(options) {
    options = _.merge({
      param    : 'id',
      error    : 'Invalid ID',
      callback(req, res, next, error) {
        throw new InvalidIdError(error);
      }
    }, options);

    return function(req, res, next) {
      if (!mongoose.Types.ObjectId.isValid(req.params[options.param])) {
        return options.callback(req, res, next, options.error);
      }
      next();
    };
  },

  /**
   * populateDocument
   * @desc Fetchs a MongoDB Document by a specified property ('id' from request params by default) and populate the request object with it.
   * @param {object} options - Options.
   * @param {string|object} options.model - The Mongoose model to query. If its a string, then the actual model is obtained from the default connection using 'mongoose.model(options.model)'. This param is taking into account if and only if 'options.method' is a string.
   * @param {string} [options.populateTo='document'] The name of the property to populate in the request object. Supports dot notation.
   * @param {string|function|object} [options.param='params.id:_id'] The criteria for querying the model.
   *   If string, it is parsed as 'src:dest', where 'src' is the property from the request object (dot notation supported) to extract the param and send it as 'dest' in side the query object.
   *   If function, it gets invoked with the request object as argument and returns an object describing the criteria object for querying.
   *   If object, it will be used as the criteria object for querying.
   * @param {string|function} [options.method='findOneAsync'] Query function.
   *   If string, it is assumed to be a property of the model.
   *   If function, it is invoked with the request object as argument.
   * @param {string} [options.projection=null] Query projection.
   * @param {string} [options.error='Resource not found'] Error message to throw in case of document not found.
   * @param {function} [options.onDocumentNotFound(req, res, next, options.error)=throws DocumentNotFoundError] - Callback that is called in case of document not found.
   * @returns If no document is found, options.onDocumentNotFound is called with 'options.error'. Else, control is passed to the next middleware.
   */
  populateDocument(options) {
    options = _.merge({
      model      : undefined,
      populateTo : 'document',
      param      : 'params.id:_id',
      method     : 'findOneAsync',
      projection : null,
      error      : 'Resource not found',
      onDocumentNotFound(req, res, next, error) {
        throw new DocumentNotFoundError(error);
      }
    }, options);

    let model;
    if (_.isString(options.model)) {
      model = mongoose.model(options.model);
    } else {
      model = options.model;
    }

    return function(req, res, next) {

      Bluebird.try(() => {
        function buildCriteria() {
          let criteria;
          if (_.isString(options.param)) {
            const pairs = options.param.split(',');

            criteria = {};
            _.forEach(pairs, pair => {
              const paramPath = pair.split(':')[0];
              const propertyName = pair.split(':')[1];
              criteria[propertyName] = _.get(req, paramPath);
            });
          } else if (_.isFunction(options.param)) {
            criteria = options.param(req);
          } else {
            criteria = options.param;
          }
          return criteria;
        }

        function buildMethod() {
          if (_.isString(options.method)) {
            return model[options.method].bind(model);
          } else {
            return options.method(req);
          }
        }

        return buildMethod()(buildCriteria(), options.projection);
      })
      .then(function(doc) {
        if (_.isEmpty(doc)) {
          return options.onDocumentNotFound(req, res, next, options.error);
        }
        _.set(req, options.populateTo, doc);
        next();
      })
      .catch(next);

    };
  },

  /**
   * validationErrorCleaner
   * @desc Helper function to transform user-unfriendly MongoDB's ValidationError errors into user-friendly ones.
   * @param {function} callback - Callback to execute on processed errors.
   * @returns Function that takes an error as argument and executes callback with processed errors.
   */
  validationErrorCleaner(callback) {
    return function(err) {
      return callback(_.map(_.keys(err.errors), function(field) {
        return err.errors[field].message;
      }));
    };
  },

  /**
   * castErrorMapper
   * @desc Helper function to map user-unfriendly MongoDB's CastError errors into customized user-friendly ones by path.
   * @param {object} errors - Error messages object.
   * @param {function} callback - Callback to execute on processed error.
   * @param {object} options - Option.
   * @param {function} [options.property='invalid'] - Property in error messages object that points to the custom message.
   * @returns Function that takes an error as argument and executes callback with processed CastError.
   */
  castErrorMapper(errors, callback, options) {
    options = _.merge({
      property: 'invalid'
    }, options);

    return function(err) {
      return callback(_.get(errors, err.path)[options.property]);
    };
  },

  /**
   * enforceSSL
   * @desc Returns a Connect-style middleware to enforce the use of SSL encryption in routes. 'trust proxy' should be enabled --> app.enable('trust proxy')
   * @param {object} options - Option.
   * @param {function} [options.port=443] - SSL port.
   * @returns Function that takes an error as argument and executes callback with processed CastError.
   * @returns If request is secure, passes control to the next middleware in chain. Else, if method is GET redirects to secured URL, otherwise throws a ForbiddenError.
   */
  enforceSSL(options) {
    options = _.merge({
      port: 443
    }, options);

    return function(req, res, next) {
      if (req.secure) {
        return next();
      }

      if (req.method === 'GET') {
        return res.redirect(301, `https://${req.hostname}:${options.port}${req.originalUrl}`);
      }

      throw new ForbiddenError('SSL Required.');

    };
  },

  /**
   * handleError
   * @desc Helper to write an error route handler for each error, instead of having to write only one with complex ifs and switches.
   * @param {error} type - Error class to catch
   * @param {function} cb - Error callback (err, req, res, next) to handle caught exception
   * @returns Express error route handler function, with signature (err, req, res, next)
   */
  handleError(type, cb) {
    return (err, req, res, next) => {
      if (err.constructor.name === type.name) {
        return cb(err, req, res, next);
      } else {
        return next(err);
      }
    };
  }

};
