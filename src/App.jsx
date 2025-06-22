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
import InstallModal from "./components/InstallModal";
import NotificationList from "./components/NotificationList";

function App() {
  const [page, setPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [photos, setPhotos] = useState({}); // { [productId]: [url, ...] }
  const [cameraPhotos, setCameraPhotos] = useState([]);
  const [nfcResult, setNfcResult] = useState("");
  const [nfcHistory, setNfcHistory] = useState([]);
  const [nfcSupported, setNfcSupported] = useState(false);
  const [nfcReading, setNfcReading] = useState(false);
  const [nfcTagInfo, setNfcTagInfo] = useState(null);
  const videoRef = useRef(null);
  const [cameraError, setCameraError] = useState("");
  const [user] = useState(userData);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Flash Sale!",
      message: "Diskon hingga 70% untuk produk gadget",
      time: "2 menit yang lalu",
      read: false,
      type: "flash_sale",
    },
    {
      id: 2,
      title: "Pesanan Dikonfirmasi",
      message: "Pesanan #12345 telah dikonfirmasi",
      time: "1 jam yang lalu",
      read: false,
      type: "order",
    },
    {
      id: 3,
      title: "Poin Bertambah",
      message: "Anda mendapat 50 poin dari pembelian",
      time: "2 jam yang lalu",
      read: true,
      type: "reward",
    },
    {
      id: 4,
      title: "Barang Baru!",
      message: "Smartphone NFC terbaru sudah tersedia",
      time: "3 jam yang lalu",
      read: false,
      type: "new_product",
    },
  ]);

  // Cek dukungan NFC
  useEffect(() => {
    if ("NDEFReader" in window) {
      setNfcSupported(true);
    }
  }, []);

  // Handle service worker messages
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        console.log("Received message from service worker:", event.data);

        if (event.data && event.data.type === "NAVIGATE") {
          handleNavigationFromNotification(event.data.url);
        }
      });
    }
  }, []);

  // Handle navigation from notification
  const handleNavigationFromNotification = (url) => {
    try {
      const urlObj = new URL(url, window.location.origin);
      const params = new URLSearchParams(urlObj.search);

      const targetPage = params.get("page");
      const productId = params.get("id");
      const tab = params.get("tab");

      if (targetPage === "product" && productId) {
        const product = productsData.find((p) => p.id === parseInt(productId));
        if (product) {
          setSelectedProduct(product);
          setPage("product");
        }
      } else if (targetPage === "home") {
        setPage("home");
        // Handle tab if needed
      } else if (targetPage === "profile") {
        setPage("profile");
        // Handle tab if needed
      } else {
        setPage("home");
      }
    } catch (error) {
      console.error("Error handling navigation from notification:", error);
      setPage("home");
    }
  };

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
    setNfcTagInfo(null);
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
        let records = [];
        for (const [i, record] of event.message.records.entries()) {
          let recordType = record.recordType || "empty";
          let mediaType = record.mediaType || "";
          let data = decoder.decode(record.data);
          records.push({
            id: i,
            recordType,
            mediaType,
            dataEncoding: record.encoding || "",
            dataSize: record.data ? record.data.byteLength : 0,
            data,
          });
          text += data + " ";
        }
        const result =
          text.trim() ||
          (records.length === 0 ? "NFC tag terbaca, tapi kosong" : "");
        setNfcResult(result);
        setNfcHistory((prev) => [result, ...prev]);
        setNfcTagInfo({
          serialNumber: event.serialNumber || "-",
          recordCount: event.message.records.length,
          records,
        });
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

  // Handle search
  const handleSearch = (query) => {
    // Implementasi pencarian bisa ditambahkan di sini
    console.log("Search query:", query);
  };

  // Handle notification click
  const handleNotification = () => {
    setShowNotifications(true);
  };

  // Handle cart click
  const handleCart = () => {
    alert("Keranjang belanja akan segera hadir!");
  };

  // Handle mark notification as read
  const handleMarkAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // Add new notification
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      time: "Baru saja",
      read: false,
      ...notification,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col max-w-sm mx-auto rounded-lg shadow-lg overflow-hidden border border-gray-200">
      <Header
        title="MarketPlay"
        onSearch={handleSearch}
        onNotification={handleNotification}
        onCart={handleCart}
      />
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
            nfcTagInfo={nfcTagInfo}
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
      <InstallModal />

      {/* Notification List Modal */}
      {showNotifications && (
        <NotificationList
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onMarkAsRead={handleMarkAsRead}
        />
      )}
    </div>
  );
}

export default App;
