import { useState, useEffect, useRef } from "react";
import {
  ArrowLeftIcon,
  CameraIcon,
  QrCodeIcon,
  PhotoIcon,
  ArrowPathIcon,
  DocumentIcon,
  PlayIcon,
  PauseIcon,
} from "@heroicons/react/24/outline";
import PhotoGallery from "../components/PhotoGallery";

const CameraPage = ({ onBack, onTakePhoto, photos, videoRef, cameraError }) => {
  const [scanMode, setScanMode] = useState("photo"); // "photo" or "barcode"
  const [barcodeResult, setBarcodeResult] = useState("");
  const [scanning, setScanning] = useState(false);
  const [cameraFacing, setCameraFacing] = useState("environment"); // "user" or "environment"
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const fileInputRef = useRef(null);

  // Get available cameras
  useEffect(() => {
    getAvailableCameras();
  }, []);

  const getAvailableCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      setAvailableCameras(videoDevices);

      // Auto-select back camera if available
      const backCamera = videoDevices.find(
        (device) =>
          device.label.toLowerCase().includes("back") ||
          device.label.toLowerCase().includes("environment") ||
          device.label.toLowerCase().includes("belakang")
      );

      if (backCamera) {
        setSelectedCamera(backCamera.deviceId);
        setCameraFacing("environment");
      } else if (videoDevices.length > 0) {
        setSelectedCamera(videoDevices[0].deviceId);
      }
    } catch (error) {
      console.error("Error getting cameras:", error);
    }
  };

  // Start camera stream
  const startCamera = async (deviceId = null) => {
    if (videoRef.current) {
      // Stop existing stream
      if (videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }

      try {
        const constraints = {
          video: {
            deviceId: deviceId ? { exact: deviceId } : undefined,
            facingMode: deviceId ? undefined : cameraFacing,
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoRef.current.srcObject = stream;
        setIsStreamActive(true);
        setIsPaused(false);
      } catch (error) {
        console.error("Error starting camera:", error);
        setCameraError("Tidak dapat mengakses kamera: " + error.message);
      }
    }
  };

  // Switch camera
  const switchCamera = async () => {
    const currentIndex = availableCameras.findIndex(
      (cam) => cam.deviceId === selectedCamera
    );
    const nextIndex = (currentIndex + 1) % availableCameras.length;
    const nextCamera = availableCameras[nextIndex];

    setSelectedCamera(nextCamera.deviceId);

    // Determine facing mode based on camera label
    const isBackCamera =
      nextCamera.label.toLowerCase().includes("back") ||
      nextCamera.label.toLowerCase().includes("environment") ||
      nextCamera.label.toLowerCase().includes("belakang");

    setCameraFacing(isBackCamera ? "environment" : "user");
    await startCamera(nextCamera.deviceId);
  };

  // Toggle camera pause
  const togglePause = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => {
        if (isPaused) {
          track.enabled = true;
        } else {
          track.enabled = false;
        }
      });
      setIsPaused(!isPaused);
    }
  };

  // Handle file input for barcode scanning
  const handleFileInput = (event) => {
    const file = event.target.files[0];
    if (file) {
      scanBarcodeFromFile(file);
    }
  };

  // Scan barcode from file
  const scanBarcodeFromFile = async (file) => {
    setScanning(true);
    setBarcodeResult("");

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        if ("BarcodeDetector" in window) {
          const barcodeDetector = new BarcodeDetector({
            formats: [
              "qr_code",
              "ean_13",
              "ean_8",
              "upc_a",
              "upc_e",
              "code_128",
              "code_39",
              "pdf417",
              "aztec",
            ],
          });

          const barcodes = await barcodeDetector.detect(canvas);

          if (barcodes.length > 0) {
            const result = barcodes[0].rawValue;
            setBarcodeResult(`Barcode terdeteksi: ${result}`);

            // Simulate product search
            setTimeout(() => {
              setBarcodeResult(
                `Produk ditemukan: Smartphone NFC - Rp3.500.000`
              );
            }, 1000);
          } else {
            setBarcodeResult("Tidak ada barcode terdeteksi dalam gambar");
          }
        } else {
          setBarcodeResult("Browser tidak mendukung Barcode Detection API");
        }
        setScanning(false);
      };

      img.onerror = () => {
        setBarcodeResult("Gagal memuat gambar");
        setScanning(false);
      };

      img.src = URL.createObjectURL(file);
    } catch (error) {
      setBarcodeResult("Error scanning barcode: " + error.message);
      setScanning(false);
    }
  };

  // Barcode scanning function from camera
  const handleBarcodeScan = async () => {
    if (!("BarcodeDetector" in window)) {
      setBarcodeResult("Browser tidak mendukung Barcode Detection API");
      return;
    }

    if (!videoRef.current || !isStreamActive) {
      setBarcodeResult("Kamera tidak aktif");
      return;
    }

    setScanning(true);
    setBarcodeResult("");

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const barcodeDetector = new BarcodeDetector({
        formats: [
          "qr_code",
          "ean_13",
          "ean_8",
          "upc_a",
          "upc_e",
          "code_128",
          "code_39",
          "pdf417",
          "aztec",
        ],
      });

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

  // Start camera when component mounts or camera changes
  useEffect(() => {
    if (selectedCamera) {
      startCamera(selectedCamera);
    }
  }, [selectedCamera]);

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
        <div className="flex items-center gap-2">
          {availableCameras.length > 1 && (
            <button
              onClick={switchCamera}
              className="p-2 rounded-full hover:bg-gray-800 transition"
              title="Ganti Kamera"
            >
              <ArrowPathIcon className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={togglePause}
            className="p-2 rounded-full hover:bg-gray-800 transition"
            title={isPaused ? "Lanjutkan" : "Jeda"}
          >
            {isPaused ? (
              <PlayIcon className="w-5 h-5" />
            ) : (
              <PauseIcon className="w-5 h-5" />
            )}
          </button>
        </div>
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
              muted
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

            {/* Camera info */}
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              {cameraFacing === "environment"
                ? "Kamera Belakang"
                : "Kamera Depan"}
            </div>
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
            {/* File input for barcode */}
            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition flex items-center justify-center gap-2"
              >
                <DocumentIcon className="w-5 h-5" />
                Pilih Gambar
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>

            <button
              onClick={handleBarcodeScan}
              disabled={scanning || !isStreamActive}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <QrCodeIcon className="w-5 h-5" />
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
