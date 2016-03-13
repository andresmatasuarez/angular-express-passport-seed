import './context';
import './promisify';

import config from 'config';
import Log    from '../utils/log';
import App    from '../app';

App.setup()
.then(() => {
  App.server.http.listen(config.server.port, () => {
    Log.info(`HTTP server listening on port ${config.server.port}`);
  });

  if (App.server.https) {
    App.server.https.listen(config.server.ssl.port, () => {
      Log.info(`HTTPS server listening on port ${config.server.ssl.port}`);
    });
  }
});
