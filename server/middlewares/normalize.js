import _ from 'lodash';

const normalizers = {
  integer(value, options) {
    const opts = options || {};
    const valueAsInt = parseInt(value, 10);
    if (!_.isNaN(valueAsInt) || !_.has(opts.defaultsTo)) {
      return valueAsInt;
    }
    return opts.defaultsTo;
  }
};

export default function normalize(path) {
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
}
