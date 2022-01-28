const endPoints = {
  main: () => '/',
  myPosts: () => '/my/posts',
  myPost: () => '/my/posts/:id',
  myNewPost: () => '/my/new-post',
  post: () => '/posts/:id',
  session: () => '/session',
  newSession: () => '/session/new',
  newUser: () => '/users/new',
  users: () => '/users',
};

const validationErrors = {
  blank: () => "Can't be a blank",
  unique: () => 'Must be unique',
  symbolsLength: (length) => `Length must be at least ${length} characters`,
  authentication: () => 'Invalid nickname or password',
};

export { endPoints, validationErrors };
