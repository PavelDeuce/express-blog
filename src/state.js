import encrypt from './encrypt.js';
import User from './models/User.js';
import Post from './models/Post.js';

const initState = () => {
  const admin = new User('admin', encrypt('admin'));
  const posts = [new Post('title1', 'Some text1'), new Post('title2', 'Some text2')];
  return { users: [admin], posts };
};

const state = initState();

export default state;
