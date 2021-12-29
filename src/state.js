import encrypt from './encrypt.js';
import User from './models/User.js';
import Post from './models/Post.js';

const initState = () => {
  const admin = new User('admin', encrypt('admin'));
  const user = new User('user', encrypt('12345'));
  const posts = [
    new Post('title1', 'Some text1', 'admin'),
    new Post('title2', 'Some text2', 'admin'),
    new Post('title3', 'Some text3', 'user'),
  ];
  return { users: [admin, user], posts };
};

const state = initState();

export default state;
