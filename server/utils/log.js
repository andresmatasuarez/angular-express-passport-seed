import config  from 'config';
import winston from 'winston';

export default new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ silent: !config.server.logs })
  ]
});
