import express  from 'express';
import Response from 'simple-response';
import Settings from '../settings';

export default function settingsRouter() {
  const router = express.Router();

  router.get('/', (req, res) => {
    Response.Ok(res)(Settings);
  });

  return router;
}
