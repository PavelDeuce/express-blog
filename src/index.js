import Express from 'express';

const app = new Express();
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('index', { title: 'Antares', message: 'Hello, world!' });
});

export default app;
