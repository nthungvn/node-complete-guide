const { validationResult } = require('express-validator');

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    message: 'OK',
    posts: [
      {
        _id: new Date().toISOString() + Math.random(),
        title: 'The first post',
        content: 'Here is the content of the first post',
        imageUrl: 'http://localhost:8080/uploads/nokia-72-black-600x600.jpg',
        createdAt: new Date(),
        creator: {
          name: 'Hung',
        },
      },
      {
        _id: new Date().toISOString() + Math.random(),
        title: 'The second post',
        content: 'Here is the content of the second post',
        createdAt: new Date(),
        creator: {
          name: 'Hung',
        },
      },
    ],
  });
};

exports.createPost = (req, res, next) => {
  const { title, content } = req.body;

  const errors = validationResult(req);

  const errorMessages = {};
  errors.array().forEach((error) => (errorMessages[error.param] = error.msg));

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed, data input are incorrect',
      errors: errorMessages,
    });
  }

  res.status(200).json({
    message: 'OK',
    post: {
      id: new Date().toISOString(),
      title: title,
      content: content,
      imageUrl: 'http://localhost:8080/uploads/nokia-72-black-600x600.jpg',
      createdAt: new Date(),
      creator: {
        name: 'Hung',
      },
    },
  });
};
