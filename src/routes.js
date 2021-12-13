export default (app) => {
  app.get('/', (req, res) => {
    res.render('index', { title: 'Antares', message: 'Hello, world!' });
  });
};
