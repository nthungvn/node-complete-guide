const products = [];

class Product {
  constructor(title) {
    this.title = title;
    // this.price = price;
    // this.image = image;
    // this.description = description;
  }

  save() {
    products.push(this);
  }

  static fetchAll() {
    return [...products];
  }
}

module.exports = Product;
