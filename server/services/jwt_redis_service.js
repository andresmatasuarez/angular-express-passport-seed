import _            from 'lodash';
import Bluebird     from 'bluebird';
import uuid         from 'node-uuid';
import jwt          from 'jsonwebtoken';
import RedisService from '../utils/redis_service';

const SECOND = 1000;

class JWTRedisServiceError extends Error {
  constructor(...args) {
    super(...args);
    this.name = 'JWTRedisServiceError';
  }
}

class UnauthorizedAccessError extends Error {
  constructor(...args) {
    super(...args);
    this.name = 'UnauthorizedAccessError';
    this.message = args[0] || `Token verification failed.
                               Admin not authenticated or token expired.`;
  }
}

class NoTokenProvidedError extends Error {
  constructor(...args) {
    super(...args);
    this.name = 'NoTokenProvidedError';
    this.message = args[0] || 'No token provided.';
  }
}

export default class JWTRedisService {

  constructor(config) {
    this.client = RedisService.createClient({
      host: config.host,
      port: config.port,
      pass: config.pass
    });

    this.issuer     = config.issuer;
    this.secret     = config.secret;
    this.keyspace   = config.keyspace;
    this.expiration = config.expiration;
  }

  sign(data) {
    const jti = uuid.v4();

    const token = jwt.sign({ jti }, this.secret, {
      issuer    : this.issuer,
      expiresIn : this.expiration / SECOND
    });

    return this.client.psetexAsync(this.keyspace + jti, this.expiration, JSON.stringify(data))
    .then((reply) => {
      if (!reply) {
        throw new JWTRedisServiceError('Session could not be stored in Redis');
      }
    })
    .thenReturn(token);
  }

  verify(token) {
    if (_.isEmpty(token)) {
      return Bluebird.reject(new NoTokenProvidedError());
    }

    return jwt.verifyAsync(token, this.secret)
    .catch(() => {
      throw new UnauthorizedAccessError();
    })
    .then((decoded) => {
      if (_.isEmpty(decoded.jti)) {
        throw new UnauthorizedAccessError();
      }
      return this.client.getAsync(this.keyspace + decoded.jti)
      .then((data) => {
        if (_.isEmpty(data)) {
          throw new UnauthorizedAccessError();
        }

        return [ decoded.jti, data ];
      });
    });
  }

  expire(token) {
    return Bluebird.try(() => {
      if (_.isEmpty(token)) {
        return null;
      }

      const data = jwt.decode(token, this.secret);

      if (_.isEmpty(data) || _.isEmpty(data.jti)) {
        return null;
      }

      return this.client.delAsync(this.keyspace + data.jti);
    });
  }
}

export { JWTRedisServiceError, UnauthorizedAccessError, NoTokenProvidedError };
