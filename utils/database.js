const mongo = require('mongodb')

module.exports = sequelize;

const connectMongo = function() {
  mongo
    .connect(
      'mongodb+srv://node-complete-guide:node-complete-guide@cluster0.oipin.mongodb.net/node-complete-guide?retryWrites=true&w=majority',
    )
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      console.error(err);
    });
};

module.exports = connectMongo;
