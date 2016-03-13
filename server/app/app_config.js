import config       from 'config';
import cookieParser from 'cookie-parser';
import passport     from 'passport';
import morgan       from 'morgan';
import compression  from 'compression';
import bodyparser   from 'body-parser';
import Admin        from '../model/admin';
import { TokenExtractor } from '../middlewares';

export default function appConfig(app) {
  passport.use(Admin.createStrategy());

  app.enable('trust proxy');

  app.set('view engine', 'jade');
  app.set('views', config.app.views.path);

  if (config.env !== config.environments.test) {
    app.use(morgan('dev'));
  }

  app.use(compression());
  app.use(bodyparser.urlencoded({ extended: true }));
  app.use(bodyparser.json());
  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(TokenExtractor);
}
