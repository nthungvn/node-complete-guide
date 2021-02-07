const mongoose = require('mongoose');
const Order = require('./order');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
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
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.getCart = function () {
  return this.cart
    .populate('items.productId')
    .execPopulate()
    .then((cart) => {
      return cart.items;
    })
    .catch((error) => {
      console.error(error);
    });
};

userSchema.methods.removeOutCart = function (productId) {
  const updatedCartItems = this.cart.items.filter(
    (item) => item.productId.toString() !== productId,
  );
  const updatedCart = { items: updatedCartItems };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.addOrder = function () {
  return this.getCart()
    .then((products) => ({
      userId: this._id,
      name: this.name,
      email: this.email,
      products: products.map((product) => ({
        productId: product.productId._id,
        title: product.productId.title,
        imageUrl: product.productId.imageUrl,
        price: product.productId.price,
        description: product.productId.description,
        quantity: product.quantity,
      })),
    }))
    .then((order) => {
      return Order.create(order);
    })
    .then(() => {
      this.cart.items = [];
      return this.save();
    })
    .catch((error) => {
      console.log(error);
    });
};

const User = mongoose.model('User', userSchema);
module.exports = User;
