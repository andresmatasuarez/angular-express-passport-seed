/** @module RouteUtils */

'use strict';

var _         = require('lodash');
var mongoose  = require('mongoose');
var Response  = require('simple-response');

module.exports = {

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
        Response.BadRequest(res)(error);
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
   * populateById
   * @desc Fetchs a MongoDB Document by its ID and populate the request object with it.
   * @param {string} modelName - The name of the model to query.
   * @param {string} populateTo - The name of the field to populate in the request object.
   * @param {object} options - Options.
   * @param {string} [options.param='id'] The name of the request param that holds the ID.
   * @param {string} [options.fields=null] Document fields to select.
   * @param {string} [options.error='Resource not found'] Error message to display in case of finding no document.
   * @param {function} [options.callback(req, res, next, error)=Sends a Not Found response with error message] - Callback that is called in case of finding no document.
   * @returns If no document is found, options.callback is called with error message. Else, control is passed to the next middleware.
   */
  populateById(modelName, populateTo, options) {
    options = _.merge({
      param    : 'id',
      fields   : null,
      error    : 'Resource not found',
      callback(req, res, next, error) {
        Response.NotFound(res)(error);
      }
    }, options);

    return function(req, res, next) {
      mongoose.model(modelName)
      .findByIdAsync(req.params[options.param], options.fields)
      .then(function(doc) {
        if (_.isEmpty(doc)) {
          return options.callback(req, res, next, options.error);
        }
        req[populateTo] = doc;
        next();
      })
      .catch(Response.InternalServerError(res));
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
