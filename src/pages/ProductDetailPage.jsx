import PhotoGallery from "../components/PhotoGallery";

const ProductDetailPage = ({
  product,
  photos,
  onScanNfc,
  onTakePhoto,
  onBack,
}) => (
  <div className="px-4 py-3">
    <button className="mb-3 text-blue-600 font-medium" onClick={onBack}>
      &larr; Kembali
    </button>
    <img
      src={product.image}
      alt={product.name}
      className="rounded-lg w-full h-40 object-cover mb-3"
    />
    <div className="font-bold text-xl mb-1">{product.name}</div>
    <div className="text-blue-600 font-bold text-lg mb-1">
      Rp{product.price.toLocaleString()}
    </div>
    <div className="text-xs text-gray-500 mb-2">{product.category}</div>
    <div className="mb-3">{product.description}</div>
    <div className="flex gap-2 mb-4">
      <button
        className="bg-blue-600 text-white rounded-lg px-4 py-2 font-medium shadow hover:bg-blue-700 transition"
        onClick={onScanNfc}
      >
        Scan NFC
      </button>
      <button
        className="bg-blue-500 text-white rounded-lg px-4 py-2 font-medium shadow hover:bg-blue-600 transition"
        onClick={onTakePhoto}
      >
        Ambil Foto
      </button>
    </div>
    <div>
      <div className="font-semibold mb-2">Galeri Foto Produk</div>
      <PhotoGallery photos={photos} />
    </div>
  </div>
);

export default ProductDetailPage;
