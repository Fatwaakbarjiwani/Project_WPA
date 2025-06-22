import { StarIcon, FireIcon } from "@heroicons/react/24/solid";

const ProductCard = ({ product, onClick }) => (
  <div
    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden border border-gray-100"
    onClick={onClick}
  >
    {/* Image container */}
    <div className="relative">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 object-cover"
      />

      {/* Flash sale badge */}
      {product.isFlashSale && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <FireIcon className="w-3 h-3" />
          Flash Sale
        </div>
      )}

      {/* Discount badge */}
      {product.discount > 0 && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
          -{product.discount}%
        </div>
      )}
    </div>

    {/* Product info */}
    <div className="p-3">
      <h3 className="font-medium text-sm text-gray-800 mb-2 line-clamp-2">
        {product.name}
      </h3>

      {/* Price */}
      <div className="mb-2">
        <span className="text-orange-500 font-bold text-lg">
          Rp{product.price.toLocaleString()}
        </span>
        {product.originalPrice > product.price && (
          <span className="text-gray-400 text-sm line-through ml-2">
            Rp{product.originalPrice.toLocaleString()}
          </span>
        )}
      </div>

      {/* Rating and sold */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <StarIcon className="w-3 h-3 text-yellow-400" />
          <span>{product.rating}</span>
        </div>
        <span>Terjual {product.sold}</span>
      </div>
    </div>
  </div>
);

export default ProductCard;
