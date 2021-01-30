const mongoose = require('mongoose');
const Product = require('./product');
const User = require('./user');

const orderSchema = new mongoose.Schema({
  name: {
    type: 'String',
    required: true,
  },
  email: {
    type: 'String',
    required: true,
  },
  products: [
    {
      title: {
        type: String,
        required: true,
      },
      imageUrl: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ],
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
