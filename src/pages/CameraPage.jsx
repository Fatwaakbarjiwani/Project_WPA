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
  const [scanMode, setScanMode] = useState("photo");
  const [qrResult, setQrResult] = useState("");
  const [scanning, setScanning] = useState(false);
  const [cameraFacing, setCameraFacing] = useState("environment");
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [currentStream, setCurrentStream] = useState(null);
  const [localCameraError, setLocalCameraError] = useState("");
  const [isInitializing, setIsInitializing] = useState(true);
  const [scanInterval, setScanInterval] = useState(null);
  const fileInputRef = useRef(null);

  // Initialize camera system
  useEffect(() => {
    initializeCamera();
  }, []);

  const initializeCamera = async () => {
    setIsInitializing(true);
    setLocalCameraError("");

    try {
      // First, request camera permission
      console.log("Requesting camera permission...");
      const initialStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      // Stop initial stream
      initialStream.getTracks().forEach((track) => track.stop());

      // Now enumerate devices
      await getAvailableCameras();
    } catch (error) {
      console.error("Camera initialization failed:", error);
      setLocalCameraError("Tidak dapat mengakses kamera: " + error.message);
    } finally {
      setIsInitializing(false);
    }
  };

  const getAvailableCameras = async () => {
    try {
      console.log("Enumerating camera devices...");
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );

      console.log("Available cameras:", videoDevices);
      setAvailableCameras(videoDevices);

      if (videoDevices.length === 0) {
        setLocalCameraError("Tidak ada kamera yang tersedia");
        return;
      }

      // Auto-select back camera if available
      const backCamera = videoDevices.find(
        (device) =>
          device.label.toLowerCase().includes("back") ||
          device.label.toLowerCase().includes("environment") ||
          device.label.toLowerCase().includes("belakang") ||
          device.label.toLowerCase().includes("rear") ||
          device.label.toLowerCase().includes("main")
      );

      if (backCamera) {
        console.log("Selected back camera:", backCamera.label);
        setSelectedCamera(backCamera.deviceId);
        setCameraFacing("environment");
      } else {
        console.log("Selected first available camera:", videoDevices[0].label);
        setSelectedCamera(videoDevices[0].deviceId);

        // Determine facing mode based on camera label
        const isFrontCamera =
          videoDevices[0].label.toLowerCase().includes("front") ||
          videoDevices[0].label.toLowerCase().includes("user") ||
          videoDevices[0].label.toLowerCase().includes("depan") ||
          videoDevices[0].label.toLowerCase().includes("selfie");
        setCameraFacing(isFrontCamera ? "user" : "environment");
      }
    } catch (error) {
      console.error("Error getting cameras:", error);
      setLocalCameraError("Gagal mendapatkan daftar kamera: " + error.message);
    }
  };

  // Start camera stream
  const startCamera = async (deviceId = null) => {
    if (!videoRef?.current) {
      console.error("Video ref not available");
      return;
    }

    // Stop existing stream
    if (currentStream) {
      console.log("Stopping existing stream...");
      currentStream.getTracks().forEach((track) => track.stop());
      setCurrentStream(null);
    }

    try {
      console.log("Starting camera with deviceId:", deviceId);

      const constraints = {
        video: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          facingMode: deviceId ? undefined : cameraFacing,
          width: { ideal: 1920, min: 640 },
          height: { ideal: 1080, min: 480 },
          frameRate: { ideal: 30, min: 15 },
        },
      };

      console.log("Camera constraints:", constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      videoRef.current.srcObject = stream;
      setCurrentStream(stream);
      setIsStreamActive(true);
      setIsPaused(false);

      console.log("Camera started successfully");
    } catch (error) {
      console.error("Error starting camera:", error);
      setLocalCameraError("Tidak dapat mengakses kamera: " + error.message);
      setIsStreamActive(false);
    }
  };

  // Switch camera
  const switchCamera = async () => {
    if (availableCameras.length < 2) {
      console.log("Only one camera available");
      return;
    }

    try {
      console.log("Switching camera...");
      const currentIndex = availableCameras.findIndex(
        (cam) => cam.deviceId === selectedCamera
      );
      const nextIndex = (currentIndex + 1) % availableCameras.length;
      const nextCamera = availableCameras[nextIndex];

      console.log("Switching to camera:", nextCamera.label);
      setSelectedCamera(nextCamera.deviceId);

      // Determine facing mode based on camera label
      const isBackCamera =
        nextCamera.label.toLowerCase().includes("back") ||
        nextCamera.label.toLowerCase().includes("environment") ||
        nextCamera.label.toLowerCase().includes("belakang") ||
        nextCamera.label.toLowerCase().includes("rear") ||
        nextCamera.label.toLowerCase().includes("main");

      setCameraFacing(isBackCamera ? "environment" : "user");
      await startCamera(nextCamera.deviceId);
    } catch (error) {
      console.error("Error switching camera:", error);
      setLocalCameraError("Gagal mengganti kamera: " + error.message);
    }
  };

  // Toggle camera pause
  const togglePause = () => {
    if (currentStream) {
      const tracks = currentStream.getTracks();
      tracks.forEach((track) => {
        track.enabled = !isPaused;
      });
      setIsPaused(!isPaused);
      console.log("Camera paused:", !isPaused);
    }
  };

  // Handle file input for QR code scanning
  const handleFileInput = (event) => {
    const file = event.target.files[0];
    if (file) {
      scanQRFromFile(file);
    }
  };

  // Scan QR code from file
  const scanQRFromFile = async (file) => {
    setScanning(true);
    setQrResult("");

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const result = await scanQRCode(canvas);
        if (result) {
          setQrResult(`QR Code terdeteksi: ${result}`);
        } else {
          setQrResult("Tidak ada QR Code terdeteksi dalam gambar");
        }
        setScanning(false);
      };

      img.onerror = () => {
        setQrResult("Gagal memuat gambar");
        setScanning(false);
      };

      img.src = URL.createObjectURL(file);
    } catch (error) {
      setQrResult("Error scanning QR code: " + error.message);
      setScanning(false);
    }
  };

  // QR Code scanning function using jsQR
  const scanQRCode = async (canvas) => {
    try {
      // Use jsQR library
      if (window.jsQR) {
        const imageData = canvas
          .getContext("2d")
          .getImageData(0, 0, canvas.width, canvas.height);
        const code = window.jsQR(
          imageData.data,
          imageData.width,
          imageData.height,
          {
            inversionAttempts: "dontInvert",
          }
        );

        if (code) {
          console.log("QR Code found:", code.data);
          return code.data;
        }
      }

      // Fallback to BarcodeDetector API
      if ("BarcodeDetector" in window) {
        const barcodeDetector = new BarcodeDetector({
          formats: ["qr_code", "qr", "aztec", "data_matrix"],
        });

        const barcodes = await barcodeDetector.detect(canvas);

        if (barcodes.length > 0) {
          console.log(
            "QR Code found via BarcodeDetector:",
            barcodes[0].rawValue
          );
          return barcodes[0].rawValue;
        }
      }

      return null;
    } catch (error) {
      console.error("Error scanning QR code:", error);
      return null;
    }
  };

  // Start continuous QR code scanning
  const startQRScanning = () => {
    if (!videoRef?.current || !isStreamActive || isPaused) {
      setQrResult("Kamera tidak aktif");
      return;
    }

    if (scanInterval) {
      clearInterval(scanInterval);
    }

    setScanning(true);
    setQrResult("Memulai scan QR Code...");

    const interval = setInterval(async () => {
      if (!videoRef?.current || isPaused) return;

      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set canvas size to video size
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        // Draw video frame to canvas
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        // Scan for QR code
        const result = await scanQRCode(canvas);

        if (result) {
          setQrResult(`QR Code terdeteksi: ${result}`);
          setScanning(false);
          clearInterval(interval);
          setScanInterval(null);

          // Simulate product search
          setTimeout(() => {
            setQrResult(`Produk ditemukan: Smartphone NFC - Rp3.500.000`);
          }, 1000);
        }
      } catch (error) {
        console.error("Error in continuous scanning:", error);
      }
    }, 500); // Scan every 500ms

    setScanInterval(interval);
  };

  // Stop QR code scanning
  const stopQRScanning = () => {
    if (scanInterval) {
      clearInterval(scanInterval);
      setScanInterval(null);
    }
    setScanning(false);
  };

  // Manual QR code scan
  const handleQRScan = async () => {
    if (!window.jsQR && !("BarcodeDetector" in window)) {
      setQrResult(
        "Browser tidak mendukung QR Code scanning. Silakan refresh halaman."
      );
      return;
    }

    if (!videoRef?.current || !isStreamActive || isPaused) {
      setQrResult("Kamera tidak aktif");
      return;
    }

    setScanning(true);
    setQrResult("");

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const result = await scanQRCode(canvas);

      if (result) {
        setQrResult(`QR Code terdeteksi: ${result}`);

        // Simulate product search
        setTimeout(() => {
          setQrResult(`Produk ditemukan: Smartphone NFC - Rp3.500.000`);
        }, 1000);
      } else {
        setQrResult("Tidak ada QR Code terdeteksi");
      }
    } catch (error) {
      setQrResult("Error scanning QR code: " + error.message);
    } finally {
      setScanning(false);
    }
  };

  // Start camera when component mounts or camera changes
  useEffect(() => {
    if (selectedCamera && !isInitializing) {
      startCamera(selectedCamera);
    }
  }, [selectedCamera, isInitializing]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
      if (scanInterval) {
        clearInterval(scanInterval);
      }
    };
  }, [currentStream, scanInterval]);

  // Use local error or prop error
  const displayError = localCameraError || cameraError;

  if (isInitializing) {
    return (
      <div className="bg-black min-h-screen flex flex-col">
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
        <div className="flex-1 flex items-center justify-center text-white">
          <div className="text-center">
            <CameraIcon className="w-16 h-16 mx-auto mb-4 text-gray-400 animate-pulse" />
            <p className="text-gray-400">Menginisialisasi kamera...</p>
          </div>
        </div>
      </div>
    );
  }

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
            QR Code
          </button>
        </div>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative">
        {displayError ? (
          <div className="flex items-center justify-center h-full text-white">
            <div className="text-center">
              <CameraIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-400 mb-4">{displayError}</p>
              <button
                onClick={initializeCamera}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
              >
                Coba Lagi
              </button>
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

            {/* Scan overlay for QR code mode */}
            {scanMode === "barcode" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-orange-500 rounded-lg relative">
                  <div className="absolute inset-0 border-2 border-orange-500 rounded-lg animate-pulse"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-orange-500 text-sm font-medium">
                    Arahkan ke QR Code
                  </div>
                </div>
              </div>
            )}

            {/* Camera info */}
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              {cameraFacing === "environment"
                ? "Kamera Belakang"
                : "Kamera Depan"}
              {availableCameras.length > 1 && (
                <span className="ml-2">({availableCameras.length} kamera)</span>
              )}
            </div>

            {/* Camera status */}
            <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              {isStreamActive ? (isPaused ? "Dijeda" : "Aktif") : "Tidak Aktif"}
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
              disabled={!isStreamActive || isPaused}
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition disabled:opacity-50"
            >
              <CameraIcon className="w-8 h-8 text-black" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* File input for QR code */}
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

            {/* QR Code scanning buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleQRScan}
                disabled={scanning || !isStreamActive || isPaused}
                className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <QrCodeIcon className="w-5 h-5" />
                {scanning ? "Scanning..." : "Scan QR Code"}
              </button>

              {!scanInterval ? (
                <button
                  onClick={startQRScanning}
                  disabled={!isStreamActive || isPaused}
                  className="bg-green-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-600 transition disabled:opacity-50"
                >
                  Auto
                </button>
              ) : (
                <button
                  onClick={stopQRScanning}
                  className="bg-red-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-600 transition"
                >
                  Stop
                </button>
              )}
            </div>

            {qrResult && (
              <div className="bg-gray-800 text-white p-3 rounded-lg text-sm">
                {qrResult}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Photo Gallery */}
      {photos && photos.length > 0 && (
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
