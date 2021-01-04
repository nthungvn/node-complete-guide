const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

const connectMongo = function () {
  return MongoClient.connect(
    'mongodb+srv://node-complete-guide:node-complete-guide@cluster0.oipin.mongodb.net/node-complete-guide?retryWrites=true&w=majority',
  );
};

module.exports = connectMongo;
