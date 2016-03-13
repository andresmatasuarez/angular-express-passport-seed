import config   from 'config';
import mongoose from 'mongoose';
import jwt      from 'jsonwebtoken';
import redis    from 'redis';
import fs       from 'fs';
import { promisifyAll } from 'bluebird';

promisifyAll(mongoose.Model);
promisifyAll(mongoose.Model.prototype);
promisifyAll(mongoose.Query.prototype);

promisifyAll(jwt);
promisifyAll(redis.RedisClient.prototype);
promisifyAll(fs);

if (config.env === config.environments.test) {
  promisifyAll(require('supertest'));
}
