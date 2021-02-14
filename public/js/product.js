function deleteProduct(btn) {
  const csrfToken = btn.parentNode.querySelector('[name="_csrf"]').value;
  const productId = btn.parentNode.querySelector('[name="productId"]').value;
  const productCard = btn.closest('article');

  fetch('/admin/products/' + productId, {
    method: 'DELETE',
    headers: {
      'csrf-token': csrfToken,
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      productCard.parentNode.removeChild(productCard);
    })
    .catch((error) => console.log(error));
}
