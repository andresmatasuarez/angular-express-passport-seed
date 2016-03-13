import _          from 'lodash';
import config     from 'config';
import fs         from 'fs';
import https      from 'https';
import Mongootils from 'mongootils';
import App        from './app';

const server = {
  http  : null,
  https : null // HTTPS server object
};

let setupPromise; // Setup singleton promise

function createHttpsEndpointFor(app, opts) {
  const sslOptions = {
    key  : fs.readFileSync(opts.key),
    cert : fs.readFileSync(opts.certificate)
  };

  if (!_.isEmpty(opts.passphrase)) {
    sslOptions.passphrase = opts.passphrase;
  }

  return https.createServer(sslOptions, app);
}

// Promise that is resolved when app has been successfully setup and rejected otherwise.
function setup() {
  if (!setupPromise) {
    setupPromise = new Mongootils(config.mongo.uri, config.mongo.options)
    .connect()
    .then(() => {
      server.http = App();

      // SSL support
      if (config.server && config.server.ssl && config.server.ssl.enable) {
        server.https = createHttpsEndpointFor(server.http, config.server.ssl);
      }
    });
  }

  return setupPromise;
}

export default {
  server,
  setup
};
