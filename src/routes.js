import _ from 'lodash';
import NotFoundError from './errors/NotFoundError.js';
import AccessDeniedError from './errors/AccessDeniedError.js';
import Guest from './models/Guest.js';
import User from './models/User.js';
import state from './state.js';
import encrypt from './encrypt.js';

const requiredAuth = (req, res, next) => {
  if (res.locals.currentUser.isGuest()) {
    const error = new AccessDeniedError();
    next(error);
  } else {
    next();
  }
};

export default (app) => {
  app.use((req, res, next) => {
    if (req.session && req.session.nickname) {
      const { nickname } = req.session;
      const { users } = state;
      res.locals.currentUser = users.find((u) => u.nickname === nickname);
    } else res.locals.currentUser = new Guest();
    next();
  });

  app.get('/', (req, res) => {
    const { posts } = state;

    res.render('posts/posts', {
      posts,
      title: 'Express Blog',
    });
  });

  app.get('/posts', (req, res) => {
    const { posts } = state;
    res.render('posts', { posts });
  });

  app.get('/users/new', (req, res) => {
    res.render('users/new', {
      form: {},
      errors: {},
    });
  });

  app.post('/users', (req, res) => {
    const cantBeBlank = "Can't be a blank";
    const { nickname, password } = req.body;
    const trimmedNickname = nickname.trim();
    const trimmedPassword = password.trim();
    const nicknames = state.users.map((n) => n.nickname);
    const errors = {};

    if (!trimmedNickname) errors.nickname = cantBeBlank;
    if (trimmedNickname && nicknames.some((n) => n === trimmedNickname))
      errors.nickname = 'Must be unique';
    if (!trimmedPassword) errors.password = cantBeBlank;
    if (trimmedPassword && trimmedPassword.length < 5)
      errors.password = 'Length must be at least 5 characters';

    if (_.keys(errors).length > 0) {
      res.status(422);
      res.render('users/new', { form: req.body, errors });
      return;
    }

    const user = new User(trimmedNickname, encrypt(trimmedPassword));
    state.users.push(user);
    res.status(200);
    res.redirect('/');
  });

  app.get('/session/new', (req, res) => {
    res.render('session/new', {
      form: {},
      errors: {},
    });
  });

  app.post('/session', (req, res) => {
    const { nickname, password } = req.body;
    const user = state.users.find((u) => u.nickname === nickname);
    if (user && user.password === encrypt(password)) {
      req.session.nickname = user.nickname;
      res.status(200);
      res.redirect('/');
      return;
    }
    res.status(422);
    res.render('session/new', { form: req.body, error: 'Invalid nickname or password' });
  });

  app.delete('/session', (req, res) => {
    delete req.session.nickname;
    res.redirect('/');
  });

  app.use((req, res, next) => {
    next(new NotFoundError());
  });

  app.use((error, req, res, next) => {
    res.status(error.status);
    switch (error.status) {
      case 404:
        res.render('errors/404');
        break;
      default:
        res.render('errors/500');
    }
    next();
  });
};
