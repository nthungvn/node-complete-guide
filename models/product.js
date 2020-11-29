const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/path');

const dataFileStorage = path.join(rootDir, 'data', 'products.json');

const readProductsFromFile = (cb) => {
  fs.readFile(dataFileStorage, (error, fileContent) => {
    if (error) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

class Product {
  constructor(title, imageUrl, price, description) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    this.id = Math.random().toString();
    readProductsFromFile((products) => {
      const updatedProducts = [...products];
      updatedProducts.push(this);
      fs.writeFile(dataFileStorage, JSON.stringify(updatedProducts), (error) => {
        console.log(error);
      });
    });
  }

  static findById(id, cb) {
    readProductsFromFile(products => {
      const product = products.find(item => item.id === id);
      cb(product);
    });
  }

  static fetchAll(cb) {
    readProductsFromFile(cb);
  }
}

module.exports = Product;
