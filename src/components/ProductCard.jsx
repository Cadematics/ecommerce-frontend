function ProductCard({ product }) {
  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button>Add to cart</button>
    </div>
  );
}

export default ProductCard;