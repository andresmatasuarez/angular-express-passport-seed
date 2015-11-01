/* eslint no-unused-vars: [2, { "args": "none" }] */
'use strict';

const config   = require('config');
const Response = require('simple-response');

module.exports = function(app) {

  // Since this is the last non-error-handling middleware,
  // we assume 404, as nothing else responded.
  app.use(function(req, res, next) {
    const err = new Error();
    err.status = 404;
    next(err);
  });

  if (config.env === config.environments.development) {

    app.use(require('errorhandler')());

  } else {

    app.use(function(err, req, res, next) {
      res.status(err.status || 500);

      const message = err.status === 404 ? 'Page not found' : 'Internal server error';

      // respond with HTML page
      if (req.accepts('html')) {
        // TODO res.render con jade
        return res.type('html').send(`<div style="color: red;">${message}</div>`);

      // respond with json
      } else if (req.accepts('json')) {
        return Response.NotFound(res)(message);

      // default: respond with plain text
      } else {
        return res.type('text').send(message);
      }
    });

  }

};
