const { ObjectId } = require('mongodb');
const { getDb } = require('../utils/database');


class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = id;
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

  addToCart(product) {
    const updatedCart = {
      items: [
        {
          productId: product.id,
          quantity: 1,
        },
      ],
    };
    return getDb()
      .collection('users')
      .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
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
