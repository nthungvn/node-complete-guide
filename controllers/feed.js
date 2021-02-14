exports.getPosts = (req, res, next) => {
  res.status(200).json({
    message: 'OK',
    posts: [
      {
        _id: new Date().toISOString(),
        title: 'The first post',
        content: 'Here is the content of the first post',
        createdAt: new Date(),
        creator: {
          name: 'Hung',
        },
      },
      {
        _id: new Date().toISOString(),
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

  res.status(200).json({
    message: 'OK',
    post: {
      _id: new Date().toISOString(),
      title: title,
      content: content,
    },
  });
};
