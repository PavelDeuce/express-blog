import AccessDeniedError from './errors/AccessDeniedError.js';

const requiredAuth = (req, res, next) => {
  if (res.locals.currentUser.isGuest()) {
    const error = new AccessDeniedError();
    next(error);
  } else {
    next();
  }
};

export default requiredAuth;
