import express   from 'express';
import appConfig from './app_config';
import appErrors from './app_errors';
import appRoutes from './app_routes';

export default function app() {
  const application = express();

  appConfig(application);
  appRoutes(application);
  appErrors(application);

  return application;
}

