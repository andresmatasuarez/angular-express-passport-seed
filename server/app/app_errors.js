/* eslint no-unused-vars: [2, { "args": "none" }] */
import config   from 'config';
import Response from 'simple-response';

export default function appErrors(app) {
  // Since this is the last non-error-handling middleware,
  // we assume 404, as nothing else responded.
  app.use((req, res, next) => {
    const err = new Error();
    err.status = 404;
    next(err);
  });

  if (config.env === config.environments.development) {
    app.use(require('errorhandler')());
  } else {
    app.use((err, req, res, next) => {
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
      }

      return res.type('text').send(message);
    });
  }
}
