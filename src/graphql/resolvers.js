const { postSignup, postLogin } = require('../controllers/auth');
const {
  createPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} = require('../controllers/feed');
const { getUser, updateUserStatus } = require('../controllers/user');

module.exports = {
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
