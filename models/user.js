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
    const updatedProductIndex = this.cart.items.findIndex(
      (item) => item.productId.toString() === product._id.toString(),
    );
    const updatedCartItems = [...this.cart.items];
    if (updatedProductIndex !== -1) {
      const previousQuantity = updatedCartItems[updatedProductIndex].quantity;
      updatedCartItems[updatedProductIndex].quantity = previousQuantity + 1;
    } else {
      updatedCartItems.push({
        productId: product._id,
        quantity: 1,
      });
    }
    const updatedCart = { items: updatedCartItems };
    return getDb()
      .collection('users')
      .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
  }

  getCart() {
    const productIds = this.cart.items.map((item) => item.productId);
    return getDb()
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((product) => {
          return {
            ...product,
            quantity: this.cart.items.find(
              (item) => item.productId.toString() === product._id.toString(),
            ).quantity,
          };
        });
      })
      .catch((error) => {
        console.error(error);
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
