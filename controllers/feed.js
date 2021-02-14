exports.getPosts = (req, res, next) => {
  res.status(200).json({
    message: 'OK',
    data: [
      {
        title: 'The first post',
        content: 'Here is the content of the first post',
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
    data: {
      title: title,
      content: content,
    },
  });
};
