const { ObjectId } = require('mongodb');
const { getDb } = require('../utils/database');

class Product {
  constructor(title, imageUrl, price, description) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    return getDb()
      .collection('products')
      .insertOne(this)
      .then((result) => {
        console.log(result);
        return result;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static fetchAll() {
    return getDb()
      .collection('products')
      .find()
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static fetchOne(productId) {
    return getDb()
      .collection('products')
      .findOne({ _id: { $eq: ObjectId(productId) } })
      .then((product) => {
        return product;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static updateOne(productId, updatedProduct) {
    return getDb()
      .collection('products')
      .updateOne(
        { _id: { $eq: ObjectId(productId) } },
        {
          $set: {
            title: updatedProduct.title,
            imageUrl: updatedProduct.imageUrl,
            description: updatedProduct.description,
            price: updatedProduct.price,
          },
        },
      )
      .then((result) => {
        console.log(result);
        return result;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static deleteOne(productId) {
    return getDb()
      .collection('products')
      .findOneAndDelete({ _id: { $eq: ObjectId(productId) } })
      .then((result) => {
        console.log(result);
        return result;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

module.exports = Product;
