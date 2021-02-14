function deleteProduct(btn) {
  const csrfToken = btn.parentNode.querySelector('[name="_csrf"]').value;
  const productId = btn.parentNode.querySelector('[name="productId"]').value;

  console.log(csrfToken, productId);
}
