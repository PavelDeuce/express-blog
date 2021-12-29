export default class Post {
  static id = 1;

  constructor(title, body, user) {
    this.id = Post.id;
    Post.id += 1;
    this.title = title;
    this.body = body;
    this.user = user;
    this.createdDate = new Date();
  }
}
