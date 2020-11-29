const products = [];

const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/path');

const p = path.join(rootDir, 'data', 'products.json');

const readProductsFromFile = (cb) => {
  fs.readFile(p, (error, fileContent) => {
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
    readProductsFromFile((products) => {
      const updatedProducts = [...products];
      updatedProducts.push(this);
      fs.writeFile(p, JSON.stringify(updatedProducts), (error) => {
        console.log(error);
      });
    });
  }

  static fetchAll(cb) {
    readProductsFromFile(cb);
  }
}

module.exports = Product;
