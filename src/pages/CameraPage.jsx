import { useState, useEffect, useRef } from "react";
import {
  ArrowLeftIcon,
  CameraIcon,
  QrCodeIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import PhotoGallery from "../components/PhotoGallery";

const CameraPage = ({ onBack, onTakePhoto, photos, videoRef, cameraError }) => {
  const [scanMode, setScanMode] = useState("photo"); // "photo" or "barcode"
  const [barcodeResult, setBarcodeResult] = useState("");
  const [scanning, setScanning] = useState(false);

  // Barcode scanning function
  const handleBarcodeScan = async () => {
    if (!("BarcodeDetector" in window)) {
      setBarcodeResult("Browser tidak mendukung Barcode Detection API");
      return;
    }

    setScanning(true);
    setBarcodeResult("");

    try {
      const barcodeDetector = new BarcodeDetector({
        formats: [
          "qr_code",
          "ean_13",
          "ean_8",
          "upc_a",
          "upc_e",
          "code_128",
          "code_39",
        ],
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const barcodes = await barcodeDetector.detect(canvas);

      if (barcodes.length > 0) {
        const result = barcodes[0].rawValue;
        setBarcodeResult(`Barcode terdeteksi: ${result}`);
        // Simulate product search
        setTimeout(() => {
          setBarcodeResult(`Produk ditemukan: Smartphone NFC - Rp3.500.000`);
        }, 1000);
      } else {
        setBarcodeResult("Tidak ada barcode terdeteksi");
      }
    } catch (error) {
      setBarcodeResult("Error scanning barcode: " + error.message);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="bg-black min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-black text-white px-4 py-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-800 transition"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold">Kamera</h1>
        <div className="w-10"></div>
      </div>

      {/* Mode Selector */}
      <div className="bg-black px-4 py-2">
        <div className="flex bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setScanMode("photo")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition ${
              scanMode === "photo"
                ? "bg-orange-500 text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            <PhotoIcon className="w-4 h-4" />
            Foto
          </button>
          <button
            onClick={() => setScanMode("barcode")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition ${
              scanMode === "barcode"
                ? "bg-orange-500 text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            <QrCodeIcon className="w-4 h-4" />
            Barcode
          </button>
        </div>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative">
        {cameraError ? (
          <div className="flex items-center justify-center h-full text-white">
            <div className="text-center">
              <CameraIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-400">{cameraError}</p>
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Scan overlay for barcode mode */}
            {scanMode === "barcode" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-orange-500 rounded-lg relative">
                  <div className="absolute inset-0 border-2 border-orange-500 rounded-lg animate-pulse"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-orange-500 text-sm font-medium">
                    Arahkan ke barcode
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Controls */}
      <div className="bg-black px-4 py-6">
        {scanMode === "photo" ? (
          <div className="flex items-center justify-center">
            <button
              onClick={onTakePhoto}
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition"
            >
              <CameraIcon className="w-8 h-8 text-black" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={handleBarcodeScan}
              disabled={scanning}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition disabled:opacity-50"
            >
              {scanning ? "Scanning..." : "Scan Barcode"}
            </button>

            {barcodeResult && (
              <div className="bg-gray-800 text-white p-3 rounded-lg text-sm">
                {barcodeResult}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Photo Gallery */}
      {photos.length > 0 && (
        <div className="bg-gray-900 px-4 py-4">
          <h3 className="text-white font-medium mb-3">Foto Terbaru</h3>
          <div className="flex gap-2 overflow-x-auto">
            {photos.slice(-5).map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`Photo ${index + 1}`}
                className="w-16 h-16 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraPage;
