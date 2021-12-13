import Express from 'express';
import routes from './routes.js';

const app = new Express();
app.set('view engine', 'pug');

routes(app);

export default app;
