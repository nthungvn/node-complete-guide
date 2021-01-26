const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
  price: Number,
  description: String,
});

const Product = mongoose.model('Product', productSchema);

// class Product {
//   constructor(title, imageUrl, price, description, id, userId) {
//     this._id = id && new ObjectId(id);
//     this.userId = userId;
// }

//   save() {
//     if (this._id) {
//       return getDb()
//         .collection('products')
//         .updateOne({ _id: this._id }, { $set: this })
//         .then((result) => {
//           console.log(result);
//           return result;
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     }
//     return getDb()
//       .collection('products')
//       .insertOne(this)
//       .then((result) => {
//         console.log(result);
//         return result;
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }

//   static fetchAll() {
//     return getDb()
//       .collection('products')
//       .find()
//       .toArray()
//       .then((products) => {
//         return products;
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }

//   static fetchOne(productId) {
//     return getDb()
//       .collection('products')
//       .findOne({ _id: { $eq: new ObjectId(productId) } })
//       .then((product) => {
//         return product;
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }

//   static deleteOne(productId) {
//     return getDb()
//       .collection('products')
//       .findOneAndDelete({ _id: { $eq: new ObjectId(productId) } })
//       .then((result) => {
//         console.log(result);
//         return result;
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }
// }

module.exports = Product;
