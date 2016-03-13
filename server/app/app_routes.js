import config     from 'config';
import path       from 'path';
import express    from 'express';
import fs         from 'fs';
import favicon    from 'serve-favicon';
import RouteUtils from '../utils/route_utils';
import api        from '../api';

const enforceSSL = RouteUtils.enforceSSL({ port: config.server.ssl.port });

function serveBundledView(view, page, bundleMappingsPath) {
  return function bundleView(req, res, next) {
    fs.readFileAsync(bundleMappingsPath)
    .then(JSON.parse)
    .then((mappings) => {
      res.render(view, {
        settings : config.app[page],
        scripts  : {
          commons : mappings.commons.js,
          app     : mappings[page].js
        }
      });
    })
    .catch(next);
  };
}

export default function appRoutes(app) {
  if (config.app.favicon) {
    app.use(favicon(path.join(__dirname, config.app.favicon)));
  } else {
    app.use('favicon.ico', (req, res) => {
      res.status(200);
      res.type('image/x-icon');
    });
  }

  // Secured content
  app.use(config.app.dashboard.base, enforceSSL);

  // Serve assets
  app.use('/', express.static(config.app.assets.path, {
    etag   : true,
    maxage : config.app.assets.maxAge,
    index  : false
  }));

  app.use('/dashboard', serveBundledView('index', 'dashboard', config.app.assets.mappings));
  app.use('/web',       serveBundledView('index', 'web',       config.app.assets.mappings));

  // URL rewrite for non-HTML5 browsers
  // Just send the index.html for other files to support HTML5Mode
  // app.all(config.app.dashboard.base + '*', function(req, res, next) {
  //   res.sendFile(config.app.dashboard.index, {
  //      root: path.join(__dirname, config.app.dashboard.root)
  //   });
  // });

  // app.all(config.app.web.base + '*', function(req, res, next) {
  //   res.sendFile(config.app.web.index, { root: path.join(__dirname, config.app.web.root) });
  // });

  // API
  app.use(config.app.api.base, api());
}
