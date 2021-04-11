import { postSignup, postLogin } from '../controllers/auth';
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from '../controllers/feed';
import { getUser, updateUserStatus } from '../controllers/user';

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
