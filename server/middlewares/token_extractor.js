import _ from 'lodash';

export default function tokenExtractor(req, res, next) {
  // Check header or URL parameters or POST parameters for token
  let token = req.headers.authorization;
  token = token || req.body.token;
  token = token || req.query.token;
  token = token || req.headers['x-access-token'];

  if (!_.isEmpty(token)) {
    token = token.replace('Bearer ', '');
  }

  req.token = token;
  next();
}
