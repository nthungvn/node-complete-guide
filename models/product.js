const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/path');
const Cart = require('./cart');

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
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    readProductsFromFile((products) => {
      const updatedProducts = [...products];
      if (this.id) {
        const updatedProductIndex = updatedProducts.findIndex(
          (product) => product.id === this.id,
        );
        updatedProducts[updatedProductIndex] = this;
      } else {
        this.id = Math.random().toString();
        updatedProducts.push(this);
      }
      fs.writeFile(
        dataFileStorage,
        JSON.stringify(updatedProducts),
        (error) => {
          if (error) {
            console.log(error);
          }
        },
      );
    });
  }

  static deleteById(id) {
    readProductsFromFile((products) => {
      const updatedProducts = [...products];
      const existingProductIndex = updatedProducts.findIndex(
        (product) => product.id === id,
      );
      const existingProduct = updatedProducts[existingProductIndex];
      if (existingProduct) {
        updatedProducts.splice(existingProductIndex, 1);
        fs.writeFile(
          dataFileStorage,
          JSON.stringify(updatedProducts),
          (error) => {
            if (error) {
              console.log(error);
            } else {
              Cart.removeProduct(id, existingProduct.price);
            }
          },
        );
      }
    });
  }

  static findById(id, cb) {
    readProductsFromFile((products) => {
      const product = products.find((item) => item.id === id);
      cb(product);
    });
  }

  static fetchAll(cb) {
    readProductsFromFile(cb);
  }
}

module.exports = Product;
