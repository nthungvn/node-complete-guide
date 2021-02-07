const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    required: true,
  },
  email: {
    type: 'String',
    required: true,
  },
  products: [
    {
      productId: {
        type: ObjectId,
        required: true,
      },
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
