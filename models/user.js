const mongoose = require('mongoose');
const Product = require('./product');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number },
      },
    ],
  },
});

const User = mongoose.model('User', userSchema);

// class User {
//   constructor(name, email, cart, id) {
//     this.cart = cart;
//     this._id = id;
//   }

//   addToCart(product) {
//     const updatedProductIndex = this.cart.items.findIndex(
//       (item) => item.productId.toString() === product._id.toString(),
//     );
//     const updatedCartItems = [...this.cart.items];
//     if (updatedProductIndex !== -1) {
//       const previousQuantity = updatedCartItems[updatedProductIndex].quantity;
//       updatedCartItems[updatedProductIndex].quantity = previousQuantity + 1;
//     } else {
//       updatedCartItems.push({
//         productId: product._id,
//         quantity: 1,
//       });
//     }
//     const updatedCart = { items: updatedCartItems };
//     return getDb()
//       .collection('users')
//       .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
//   }

//   removeOutCart(productId) {
//     const updatedCartItems = this.cart.items.filter(
//       (item) => item.productId.toString() !== productId,
//     );
//     const updatedCart = { items: updatedCartItems };
//     return getDb()
//       .collection('users')
//       .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
//   }

//   getCart() {
//     const productIds = this.cart.items.map((item) => item.productId);
//     return getDb()
//       .collection('products')
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then((products) => {
//         return products.map((product) => {
//           return {
//             ...product,
//             quantity: this.cart.items.find(
//               (item) => item.productId.toString() === product._id.toString(),
//             ).quantity,
//           };
//         });
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   }

//   addOrder() {
//     return this.getCart()
//       .then((products) => ({
//         userId: this._id,
//         products: products,
//       }))
//       .then((order) => {
//         return getDb().collection('orders').insertOne(order);
//       })
//       .then(() => {
//         this.cart.items = [];
//         return getDb()
//           .collection('users')
//           .updateOne({ _id: this._id }, { $set: { cart: { items: [] } } });
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }

//   getOrders() {
//     return getDb()
//       .collection('orders')
//       .find({ userId: this._id })
//       .toArray()
//       .then((orders) => {
//         return orders;
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }

//   static findById(id) {
//     return getDb()
//       .collection('users')
//       .findOne({ _id: new ObjectId(id) })
//       .then((result) => {
//         return result;
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }
// }

module.exports = User;
