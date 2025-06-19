const ProductCard = ({ product, onClick }) => (
  <div
    className="bg-white rounded-xl shadow hover:shadow-lg transition p-3 flex flex-col cursor-pointer"
    onClick={onClick}
  >
    <img
      src={product.image}
      alt={product.name}
      className="rounded-lg w-full h-32 object-cover mb-2"
    />
    <div className="font-semibold text-base mb-1">{product.name}</div>
    <div className="text-blue-600 font-bold text-lg mb-1">
      Rp{product.price.toLocaleString()}
    </div>
    <div className="text-xs text-gray-500">{product.category}</div>
  </div>
);

export default ProductCard;
