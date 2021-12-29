import Express from 'express';
import session from 'express-session';
import favicon from 'serve-favicon';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import routes from './routes.js';

const app = new Express();

app.use(favicon('public/favicon.ico'));
app.use(methodOverride('_method'));
app.set('view engine', 'pug');
app.use('/css', Express.static('node_modules/bootstrap/dist/css'));
app.use(
  session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(bodyParser.urlencoded({ extended: false }));

routes(app);

export default app;
