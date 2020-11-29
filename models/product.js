const products = [];

const { EROFS } = require('constants');
const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/path');

class Product {
  constructor(title) {
    this.title = title;
    // this.price = price;
    // this.image = image;
    // this.description = description;
  }

  save() {
    const p = path.join(rootDir, 'data', 'products.json');
    fs.readFile(p, (error, fileContent) => {
      let products = [];
      if (!error) {
        products = JSON.parse(fileContent);
      }
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (error) => {
        console.log(error);
      });
    });
  }

  static fetchAll(cb) {
    const p = path.join(rootDir, 'data', 'products.json');
    fs.readFile(p, (error, fileContent) => {
      if (error) {
        cb([]);
      } else {
        cb(JSON.parse(fileContent));
      }
    });
  }
}

module.exports = Product;
