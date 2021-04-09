import { postSignup, postLogin } from '../controllers/auth.js';
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from '../controllers/feed.js';
import { getUser, updateUserStatus } from '../controllers/user.js';

export default {
  createUser: postSignup,
  login: postLogin,
  createPost: createPost,
  getPosts: getPosts,
  getPost: getPost,
  updatePost: updatePost,
  deletePost: deletePost,
  getUser: getUser,
  updateUserStatus: updateUserStatus,
};
