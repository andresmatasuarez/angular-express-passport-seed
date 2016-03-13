import express  from 'express';
import Response from 'simple-response';
import { Auth } from '../middlewares';

export default function authRouter() {
  const router = express.Router();

  router.get('/me', Auth.ensureAuthenticated(), (req, res) => {
    Response.Ok(res)(req.auth.user);
  });

  router.post('/login', Auth.authenticate(), Auth.login());

  router.post('/logout', Auth.logout());

  return router;
}

