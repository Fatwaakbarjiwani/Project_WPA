import { useState, useRef, useEffect } from "react";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import NFCPage from "./pages/NFCPage";
import CameraPage from "./pages/CameraPage";
import ProfilePage from "./pages/ProfilePage";
import productsData from "./data/products";
import userData from "./data/user";
import InstallPrompt from "./components/InstallPrompt";
import InstallModal from "./components/InstallModal";

function App() {
  const [page, setPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [photos, setPhotos] = useState({}); // { [productId]: [url, ...] }
  const [cameraPhotos, setCameraPhotos] = useState([]);
  const [nfcResult, setNfcResult] = useState("");
  const [nfcHistory, setNfcHistory] = useState([]);
  const [nfcSupported, setNfcSupported] = useState(false);
  const [nfcReading, setNfcReading] = useState(false);
  const videoRef = useRef(null);
  const [cameraError, setCameraError] = useState("");
  const [user] = useState(userData);

  // Cek dukungan NFC
  useEffect(() => {
    if ("NDEFReader" in window) {
      setNfcSupported(true);
    }
  }, []);

  // Kamera: Mulai stream saat masuk halaman kamera
  useEffect(() => {
    if (page === "camera" && videoRef.current) {
      setCameraError("");
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((err) => {
          setCameraError("Tidak dapat mengakses kamera: " + err.message);
        });
      return () => {
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = videoRef.current.srcObject.getTracks();
          tracks.forEach((track) => track.stop());
        }
      };
    }
  }, [page]);

  // Ambil foto dari kamera
  const handleTakePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const url = canvas.toDataURL("image/png");
    if (selectedProduct) {
      setPhotos((prev) => ({
        ...prev,
        [selectedProduct.id]: [...(prev[selectedProduct.id] || []), url],
      }));
    } else {
      setCameraPhotos((prev) => [...prev, url]);
    }
  };

  // NFC: Mulai scan
  const handleScanNfc = async () => {
    setNfcResult("");
    setNfcReading(true);
    if (!("NDEFReader" in window)) {
      setNfcResult(
        "Browser tidak mendukung Web NFC. Silakan gunakan Chrome di Android."
      );
      setNfcReading(false);
      return;
    }
    try {
      const ndef = new window.NDEFReader();
      await ndef.scan();
      let timeoutId = setTimeout(() => {
        setNfcResult(
          "Tidak ada tag NFC yang terbaca. Silakan coba lagi dan pastikan tag didekatkan ke perangkat."
        );
        setNfcReading(false);
      }, 10000); // 10 detik timeout
      ndef.onreading = (event) => {
        clearTimeout(timeoutId);
        const decoder = new TextDecoder();
        let text = "";
        for (const record of event.message.records) {
          text += decoder.decode(record.data) + " ";
        }
        const result = text.trim() || "NFC tag terbaca, tapi kosong";
        setNfcResult(result);
        setNfcHistory((prev) => [result, ...prev]);
        setNfcReading(false);
      };
      ndef.onerror = (err) => {
        clearTimeout(timeoutId);
        setNfcResult("Gagal membaca NFC: " + (err?.message || err));
        setNfcReading(false);
      };
    } catch (err) {
      setNfcResult("Gagal memulai scan NFC: " + (err?.message || err));
      setNfcReading(false);
    }
  };

  // Navigasi ke detail produk
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setPage("product");
  };

  // Navigasi kembali
  const handleBack = () => {
    if (page === "product") setSelectedProduct(null);
    setPage("home");
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col max-w-sm mx-auto rounded-lg shadow-lg overflow-hidden border border-gray-200">
      <Header title="E-Commerce NFC" />
      <main className="flex-1 overflow-y-auto">
        {page === "home" && (
          <HomePage
            products={productsData}
            onProductClick={handleProductClick}
            user={user}
          />
        )}
        {page === "product" && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            photos={photos[selectedProduct.id] || []}
            onScanNfc={() => setPage("nfc")}
            onTakePhoto={() => setPage("camera")}
            onBack={handleBack}
          />
        )}
        {page === "nfc" && (
          <NFCPage
            onBack={handleBack}
            onScan={handleScanNfc}
            nfcResult={nfcResult}
            nfcHistory={nfcHistory}
            nfcSupported={nfcSupported}
            nfcReading={nfcReading}
          />
        )}
        {page === "camera" && (
          <CameraPage
            onBack={handleBack}
            onTakePhoto={handleTakePhoto}
            photos={
              selectedProduct ? photos[selectedProduct.id] || [] : cameraPhotos
            }
            videoRef={videoRef}
            cameraError={cameraError}
          />
        )}
        {page === "profile" && <ProfilePage user={user} onBack={handleBack} />}
      </main>
      <BottomNav page={page === "product" ? "home" : page} setPage={setPage} />
      {/* <InstallPrompt /> */}
      <InstallModal />
    </div>
  );
}

export default App;
