import _ from 'lodash';
import NotFoundError from './errors/NotFoundError.js';
import Guest from './models/Guest.js';
import User from './models/User.js';
import Post from './models/Post.js';
import state from './state.js';
import encrypt from './encrypt.js';
import { endPoints, validationErrors } from './constants/index.js';
import requiredAuth from './required-auth.js';

export default (app) => {
  app.use((req, res, next) => {
    if (req.session && req.session.nickname) {
      const { nickname } = req.session;
      const { users } = state;
      res.locals.currentUser = users.find((u) => u.nickname === nickname);
    } else res.locals.currentUser = new Guest();
    next();
  });

  app.get(endPoints.main(), (req, res) => {
    const { posts } = state;

    res.render('posts/posts', {
      posts,
      title: 'Express Blog',
    });
  });

  app.get(endPoints.post(), (req, res, next) => {
    const post = state.posts.find((p) => p.id === Number(req.params.id));
    if (post) {
      res.render('posts/show-post', { title: `Post: ${post.title}`, post });
    } else {
      next(new NotFoundError());
    }
  });

  app.get(endPoints.newUser(), (req, res) => {
    res.render('users/new', {
      title: 'Signup',
      form: {},
      errors: {},
    });
  });

  app.post(endPoints.users(), (req, res) => {
    const { nickname, password } = req.body;
    const trimmedNickname = nickname.trim();
    const trimmedPassword = password.trim();
    const nicknames = state.users.map((n) => n.nickname);
    const errors = {};
    const passwordLength = 5;

    if (!trimmedNickname) errors.nickname = validationErrors.blank();
    if (trimmedNickname && nicknames.some((n) => n === trimmedNickname))
      errors.nickname = validationErrors.unique();
    if (!trimmedPassword) errors.password = validationErrors.blank();
    if (trimmedPassword && trimmedPassword.length < passwordLength)
      errors.password = validationErrors.symbolsLength(passwordLength);

    if (_.keys(errors).length > 0) {
      res.status(422);
      res.render('users/new', { title: 'Signup', form: req.body, errors });
      return;
    }

    const user = new User(trimmedNickname, encrypt(trimmedPassword));
    state.users.push(user);
    res.status(200);
    res.flash('success', 'Successful registration!');
    res.redirect(endPoints.main());
  });

  app.get(endPoints.newSession(), (req, res) => {
    res.render('session/new', {
      title: 'Login',
      form: {},
      errors: {},
    });
  });

  app
    .route(endPoints.session())
    .post((req, res) => {
      const { nickname, password } = req.body;
      const user = state.users.find((u) => u.nickname === nickname);
      if (user && user.password === encrypt(password)) {
        req.session.nickname = user.nickname;
        res.status(200);
        res.flash('info', `Welcome, ${user.nickname}!`);
        res.redirect(endPoints.main());
        return;
      }
      res.status(422);
      res.render('session/new', {
        title: 'Login',
        form: req.body,
        errors: { authentication: validationErrors.authentication() },
      });
    })
    .delete((req, res) => {
      res.flash('info', `Goodbye, ${res.locals.currentUser.nickname}`);
      delete req.session.nickname;
      res.redirect(endPoints.main());
    });

  app
    .route(endPoints.myPosts())
    .get(requiredAuth, (req, res) => {
      const { posts } = state;
      const userPosts = posts.filter((p) => p.user === res.locals.currentUser.nickname);
      res.render('my/posts', { title: 'My posts', posts: userPosts });
    })
    .post(requiredAuth, (req, res) => {
      const { title, body } = req.body;
      const trimmedTitle = title.trim();
      const trimmedBody = body.trim();
      const errors = {};

      if (!trimmedTitle) errors.title = validationErrors.blank();
      if (!trimmedBody) errors.body = validationErrors.blank();

      if (_.keys(errors).length === 0) {
        const post = new Post(trimmedTitle, trimmedBody, res.locals.currentUser.nickname);
        state.posts.push(post);
        res.status(200);
        res.flash('success', 'New post is published!');
        res.redirect(`/my/posts/${post.id}`);
        return;
      }
      res.status(422);
      res.render('my/new-post', { title: 'New post', form: req.body, errors });
    });

  app
    .route(endPoints.myPost())
    .get(requiredAuth, (req, res, next) => {
      const post = state.posts.find(
        (p) => p.user === res.locals.currentUser.nickname && p.id === Number(req.params.id),
      );
      if (post) {
        res.render('my/edit-post', { title: `Post: ${post.title}`, post, form: post, errors: {} });
      } else {
        next(new NotFoundError());
      }
    })
    .patch(requiredAuth, (req, res, next) => {
      const post = state.posts.find(
        (p) => p.user === res.locals.currentUser.nickname && p.id === Number(req.params.id),
      );
      if (post) {
        const { title, body } = req.body;
        const trimmedTitle = title.trim();
        const trimmedBody = body.trim();
        const errors = {};

        if (!trimmedTitle) errors.title = validationErrors.blank();
        if (!trimmedBody) errors.body = validationErrors.blank();

        if (_.keys(errors).length === 0) {
          post.title = trimmedTitle;
          post.body = trimmedBody;
          res.flash('success', 'The post is changed!');
          res.redirect(`/my/posts/${post.id}`);
          return;
        }

        res.status(422);
        res.render('my/edit-post', { post, form: req.body, errors });
      } else {
        next(new NotFoundError());
      }
    })
    .delete(requiredAuth, (req, res) => {
      state.posts = state.posts.filter(
        (p) => !(p.id === Number(req.params.id) && res.locals.currentUser.nickname === p.user),
      );
      res.status(200);
      res.redirect('/my/posts');
    });

  app.get(endPoints.myNewPost(), requiredAuth, (req, res) => {
    res.render('my/new-post', { title: 'New post', form: {}, errors: {} });
  });

  app.use((req, res, next) => {
    next(new NotFoundError());
  });

  app.use((error, req, res, next) => {
    res.status(error.status);
    switch (error.status) {
      case 403:
        res.render('errors/403');
        break;
      case 404:
        res.render('errors/404');
        break;
      default:
        res.render('errors/500');
    }
    next();
  });
};
