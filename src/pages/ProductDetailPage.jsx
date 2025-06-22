import {
  ArrowLeftIcon,
  StarIcon,
  FireIcon,
  ShoppingCartIcon,
  HeartIcon,
  QrCodeIcon,
  CameraIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import PhotoGallery from "../components/PhotoGallery";

const ProductDetailPage = ({
  product,
  photos,
  onScanNfc,
  onTakePhoto,
  onBack,
}) => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between shadow-sm">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Detail Produk</h1>
        <div className="flex gap-2">
          <button className="p-2 rounded-full hover:bg-gray-100 transition">
            <HeartIcon className="w-6 h-6 text-gray-600" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 transition">
            <ShoppingCartIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Product Image */}
      <div className="bg-white">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-80 object-cover"
          />

          {/* Flash sale badge */}
          {product.isFlashSale && (
            <div className="absolute top-4 left-4 bg-red-500 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
              <FireIcon className="w-4 h-4" />
              Flash Sale
            </div>
          )}

          {/* Discount badge */}
          {product.discount > 0 && (
            <div className="absolute top-4 right-4 bg-red-500 text-white text-sm px-3 py-1 rounded-full font-semibold">
              -{product.discount}%
            </div>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h1>

        {/* Price */}
        <div className="mb-3">
          <span className="text-orange-500 font-bold text-2xl">
            Rp{product.price.toLocaleString()}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-gray-400 text-lg line-through ml-2">
              Rp{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Rating and sold */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1">
            <StarIconSolid className="w-4 h-4 text-yellow-400" />
            <span className="font-medium text-sm">{product.rating}</span>
            <span className="text-gray-500 text-sm">
              ({product.sold} terjual)
            </span>
          </div>
          <span className="text-gray-500 text-sm">{product.category}</span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onScanNfc}
            className="flex items-center justify-center gap-2 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition"
          >
            <QrCodeIcon className="w-5 h-5" />
            Scan NFC
          </button>
          <button
            onClick={onTakePhoto}
            className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition"
          >
            <CameraIcon className="w-5 h-5" />
            Foto Produk
          </button>
        </div>

        <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition mt-3 flex items-center justify-center gap-2">
          <ShoppingCartIcon className="w-5 h-5" />
          Beli Sekarang
        </button>
      </div>

      {/* Photo Gallery */}
      {photos.length > 0 && (
        <div className="bg-white px-4 py-4">
          <h3 className="font-semibold text-gray-800 mb-3">Foto Produk</h3>
          <PhotoGallery photos={photos} />
        </div>
      )}

      {/* Product Details */}
      <div className="bg-white px-4 py-4 mt-2">
        <h3 className="font-semibold text-gray-800 mb-3">Detail Produk</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Kategori</span>
            <span className="font-medium">{product.category}</span>
          </div>
          <div className="flex justify-between">
            <span>Rating</span>
            <span className="font-medium">{product.rating}/5.0</span>
          </div>
          <div className="flex justify-between">
            <span>Terjual</span>
            <span className="font-medium">{product.sold} unit</span>
          </div>
          {product.discount > 0 && (
            <div className="flex justify-between">
              <span>Diskon</span>
              <span className="font-medium text-red-500">
                {product.discount}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
