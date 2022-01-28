import Express from 'express';
import session from 'express-session';
import favicon from 'serve-favicon';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import morgan from 'morgan';
import flash from 'flash';
import routes from './routes.js';

const app = new Express();
const logger = morgan('combined');

app.use(favicon('public/favicon.ico'));
app.use(methodOverride('_method'));
app.use(logger);
app.set('view engine', 'pug');
app.use('/css', Express.static('node_modules/bootstrap/dist/css'));
app.use(
  session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }));

routes(app);

export default app;
