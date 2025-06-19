import PhotoGallery from "../components/PhotoGallery";

const CameraPage = ({ onBack, onTakePhoto, photos, videoRef, cameraError }) => (
  <div className="px-4 py-3">
    <button className="mb-3 text-blue-600 font-medium" onClick={onBack}>
      &larr; Kembali
    </button>
    <h2 className="text-xl font-bold mb-2">Ambil Foto Produk</h2>
    <div className="w-full flex justify-center mb-4">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="rounded-lg border border-gray-300 w-full max-w-xs aspect-video bg-black"
      />
    </div>
    {cameraError && <div className="text-red-500 mb-2">{cameraError}</div>}
    <button
      className="bg-blue-600 text-white rounded-lg px-4 py-2 font-medium shadow hover:bg-blue-700 transition mb-4 w-full"
      onClick={onTakePhoto}
    >
      Ambil Foto
    </button>
    <div>
      <div className="font-semibold mb-2">Galeri Foto</div>
      <PhotoGallery photos={photos} />
    </div>
  </div>
);

export default CameraPage;
