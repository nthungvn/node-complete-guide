const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

/**
 * @type {mongo.Db}
 */
let _db;

const connectMongo = function (callback) {
  MongoClient.connect(
    'mongodb+srv://node-complete-guide:node-complete-guide@cluster0.oipin.mongodb.net/node-complete-guide?retryWrites=true&w=majority',
    {
      useUnifiedTopology: true,
    },
  )
    .then((client) => {
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
    });
};

const getDb = () => {
  return _db;
};

exports.connectMongo = connectMongo;
exports.getDb = getDb;
