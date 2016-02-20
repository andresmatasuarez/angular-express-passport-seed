'use strict';

const _ = require('lodash');

const normalizers = {
  integer(value, options) {
    options = options || {};
    const valueAsInt = parseInt(value);
    if (!_.isNaN(valueAsInt) || !_.has(options.defaultsTo)) {
      return valueAsInt;
    } else {
      return options.defaultsTo;
    }
  }
};

module.exports = function(path) {
  return {
    as(type, options) {
      const normalizer = normalizers[type];

      return (req, res, next) => {
        if (_.has(req, path)) {
          const value = _.get(req, path);
          _.set(req, path, normalizer(value, options));
        }
        next();
      };
    }
  };
};
