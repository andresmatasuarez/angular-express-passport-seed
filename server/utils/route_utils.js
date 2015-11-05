/** @module RouteUtils */

'use strict';

var _         = require('lodash');
var util      = require('util');
var mongoose  = require('mongoose');
var Bluebird  = require('bluebird');
var Response  = require('simple-response');

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

util.inherits(InvalidIdError, Error);
util.inherits(DocumentNotFoundError, Error);

module.exports = {

  InvalidIdError,
  DocumentNotFoundError,

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
   * @desc Fetchs a MongoDB Document by a specified property (_id by default) and populate the request object with it.
   * @param {string} modelName - The name of the model to query.
   * @param {string} populateTo - The name of the field to populate in the request object.
   * @param {object} options - Options.
   * @param {string} [options.param='id'] The name of the request param that holds the ID.
   * @param {string} [options.projection=null] Document fields to select.
   * @param {string} [options.error='Resource not found'] Error message to display in case of finding no document.
   * @param {function} [options.callback(req, res, next, error)=Sends a Not Found response with error message] - Callback that is called in case of finding no document.
   * @returns If no document is found, options.callback is called with error message. Else, control is passed to the next middleware.
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
   * @returns If request object is not secure, if method is GET then redirects to secured URL, else respond with 403. Else, control is passed to the next middleware.
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

      Response.Forbidden(res)('SSL Required.');
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
