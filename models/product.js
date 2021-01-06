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
      .findOne({ _id: productId })
      .then((product) => {
        return product;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

module.exports = Product;
