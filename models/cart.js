const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/path');

const dataFileStorage = path.join(rootDir, 'data', 'cart.json');

class Cart {
  static addProduct(id, price) {
    fs.readFile(dataFileStorage, (error, fileContent) => {
      let cart = {
        products: [],
        totalPrice: 0,
      };

      if (!error) {
        cart = JSON.parse(fileContent);
      }

      const existingProductIndex = cart.products.findIndex(
        (product) => product.id === id,
      );
      const existingProduct = cart.products[existingProductIndex];
      if (!existingProduct) {
        const newProduct = {
          id: id,
          quantity: 1,
        };
        cart.products = [...cart.products, newProduct];
      } else {
        const updatedProduct = { ...existingProduct };
        updatedProduct.quantity = updatedProduct.quantity + 1;
        const updatedProducts = [...cart.products];
        updatedProducts[existingProductIndex] = updatedProduct;
        cart.products = updatedProducts;
      }
      cart.totalPrice = cart.totalPrice + +price;
      fs.writeFile(dataFileStorage, JSON.stringify(cart), (error) => {
        console.log(error);
      });
    });
  }
}

module.exports = Cart;
