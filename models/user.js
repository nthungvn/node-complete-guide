const { ObjectId } = require('mongodb');
const { getDb } = require('../utils/database');


class User {
  constructor(name, email, id) {
    this.name = name;
    this.email = email;
    this._id = id && new ObjectId(id);
  }

  save() {
    return getDb()
      .collection('users')
      .insertOne(this)
      .then((result) => {
        return result;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static findById(id) {
    return getDb()
      .collection('users')
      .findOne({ _id: new ObjectId(id) })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

module.exports = User;
