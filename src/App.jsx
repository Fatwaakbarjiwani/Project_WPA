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

  // RFID states
  const [rfidResult, setRfidResult] = useState("");
  const [rfidHistory, setRfidHistory] = useState([]);
  const [rfidReading, setRfidReading] = useState(false);
  const [rfidTagInfo, setRfidTagInfo] = useState(null);
  const [scanMode, setScanMode] = useState("nfc"); // "nfc" or "rfid"

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

  // Cek dukungan NFC/RFID
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
      }, 15000); // 15 detik timeout untuk KTP

      // Handle successful reading
      ndef.onreading = (event) => {
        clearTimeout(timeoutId);
        console.log("NFC Tag detected:", event);

        const decoder = new TextDecoder();
        let text = "";
        let records = [];
        let tagInfo = {
          serialNumber: event.serialNumber || "Unknown",
          recordCount: 0,
          records: [],
          tagType: "NFC",
          timestamp: new Date().toISOString(),
          atqa: event.atqa || null,
          sak: event.sak || null,
          historicalBytes: event.historicalBytes || null,
          hiLayerResponse: event.hiLayerResponse || null,
          timeout: event.timeout || null,
          extendedLengthApduSupported:
            event.extendedLengthApduSupported || null,
          maxTransceiveLength: event.maxTransceiveLength || null,
          techList: event.techList || null,
          rawEvent: event,
        };

        // Process NDEF records if available
        if (event.message && event.message.records) {
          tagInfo.recordCount = event.message.records.length;

          for (const [i, record] of event.message.records.entries()) {
            let recordType = record.recordType || "empty";
            let mediaType = record.mediaType || "";
            let data = "";
            let recordInfo = {
              id: i,
              recordType,
              mediaType,
              dataEncoding: record.encoding || "",
              dataSize: record.data ? record.data.byteLength : 0,
              data: "",
            };

            try {
              // Handle different data formats
              if (record.data) {
                if (recordType === "text") {
                  data = decoder.decode(record.data);
                } else if (recordType === "url") {
                  data = decoder.decode(record.data);
                } else if (
                  recordType === "mime" &&
                  mediaType === "application/json"
                ) {
                  data = decoder.decode(record.data);
                } else {
                  // Try to decode as text, if fails show as hex
                  try {
                    data = decoder.decode(record.data);
                  } catch (e) {
                    // Convert to hex string for binary data
                    const bytes = new Uint8Array(record.data);
                    data = Array.from(bytes, (byte) =>
                      byte.toString(16).padStart(2, "0")
                    ).join(" ");
                  }
                }
              }

              recordInfo.data = data;
              records.push(recordInfo);
              text += data + " ";
            } catch (e) {
              console.warn("Failed to decode NFC record:", e);
              recordInfo.data = "Binary data (decode failed)";
              records.push(recordInfo);
            }
          }
        }

        // Check if this might be a KTP
        const isKTP = checkIfKTP(event.serialNumber, text, records);

        // Format result
        let result = "";
        if (isKTP) {
          result = `KTP Terdeteksi!\nID: ${event.serialNumber}\nData: ${
            text.trim() || "Data KTP (terenkripsi)"
          }`;
        } else if (text.trim()) {
          result = `NFC Tag ID: ${event.serialNumber}\nData: ${text.trim()}`;
        } else {
          result = `NFC Tag ID: ${event.serialNumber} (No readable data)`;
        }

        tagInfo.records = records;
        if (isKTP) {
          tagInfo.tagType = "KTP";
          tagInfo.note = "Kartu Tanda Penduduk terdeteksi";
        }

        setNfcResult(result);
        setNfcHistory((prev) => [result, ...prev]);
        setNfcTagInfo(tagInfo);
        setNfcReading(false);
      };

      // Handle reading errors
      ndef.onerror = (err) => {
        clearTimeout(timeoutId);
        console.error("NFC Error:", err);

        let errorMessage = "Gagal membaca NFC: " + (err?.message || err);

        // Provide more specific error messages
        if (err?.name === "NotAllowedError") {
          errorMessage =
            "Izin NFC ditolak. Silakan izinkan akses NFC di pengaturan browser.";
        } else if (err?.name === "NotSupportedError") {
          errorMessage = "Perangkat tidak mendukung NFC atau NFC tidak aktif.";
        } else if (err?.name === "AbortError") {
          errorMessage = "Scan NFC dibatalkan.";
        }

        setNfcResult(errorMessage);
        setNfcReading(false);
      };

      // Handle reading without NDEF data (for empty tags or KTP)
      ndef.onreadingerror = (err) => {
        clearTimeout(timeoutId);
        console.log("NFC Reading Error (possibly empty tag or KTP):", err);

        // Try to get serial number even if NDEF reading fails
        if (err && err.serialNumber) {
          const isKTP = checkIfKTP(err.serialNumber, "", []);
          let result = "";

          if (isKTP) {
            result = `KTP Terdeteksi!\nID: ${err.serialNumber}\nData: Data KTP (terenkripsi atau tidak dapat dibaca)`;
          } else {
            result = `NFC Tag ID: ${err.serialNumber} (No NDEF data)`;
          }

          setNfcResult(result);
          setNfcHistory((prev) => [result, ...prev]);
          setNfcTagInfo({
            serialNumber: err.serialNumber,
            recordCount: 0,
            records: [],
            tagType: isKTP ? "KTP" : "NFC",
            timestamp: new Date().toISOString(),
            note: isKTP
              ? "KTP terdeteksi tapi data terenkripsi"
              : "Tag detected but no NDEF data found",
            atqa: err.atqa || null,
            sak: err.sak || null,
            historicalBytes: err.historicalBytes || null,
            hiLayerResponse: err.hiLayerResponse || null,
            timeout: err.timeout || null,
            extendedLengthApduSupported:
              err.extendedLengthApduSupported || null,
            maxTransceiveLength: err.maxTransceiveLength || null,
            techList: err.techList || null,
            rawEvent: err,
          });
        } else {
          setNfcResult("Tag terdeteksi tapi tidak dapat membaca data");
        }
        setNfcReading(false);
      };
    } catch (err) {
      console.error("NFC Scan Error:", err);
      setNfcResult("Gagal memulai scan NFC: " + (err?.message || err));
      setNfcReading(false);
    }
  };

  // Helper function to check if tag might be a KTP
  const checkIfKTP = (serialNumber, text, records) => {
    // KTP typically has specific characteristics:
    // 1. Serial number might start with specific patterns
    // 2. May contain specific data patterns
    // 3. Usually has encrypted or binary data

    const serialStr = serialNumber.toString().toLowerCase();
    const textLower = text.toLowerCase();

    // Check serial number patterns (Indonesian KTP patterns)
    if (
      serialStr.includes("ktp") ||
      serialStr.includes("e-ktp") ||
      serialStr.includes("nik") ||
      serialStr.length === 16
    ) {
      return true;
    }

    // Check for KTP-related text in data
    if (
      textLower.includes("ktp") ||
      textLower.includes("nik") ||
      textLower.includes("indonesia") ||
      textLower.includes("republik")
    ) {
      return true;
    }

    // Check for specific record types that might indicate KTP
    const ktpRecordTypes = [
      "application/vnd.wfa.wsc",
      "application/octet-stream",
    ];
    if (records.some((record) => ktpRecordTypes.includes(record.recordType))) {
      return true;
    }

    return false;
  };

  // RFID: Mulai scan
  const handleScanRfid = async () => {
    setRfidResult("");
    setRfidReading(true);
    setRfidTagInfo(null);

    if (!("NDEFReader" in window)) {
      setRfidResult(
        "Browser tidak mendukung Web NFC/RFID. Silakan gunakan Chrome di Android."
      );
      setRfidReading(false);
      return;
    }

    try {
      const ndef = new window.NDEFReader();
      await ndef.scan();

      let timeoutId = setTimeout(() => {
        setRfidResult(
          "Tidak ada tag RFID yang terbaca. Silakan coba lagi dan pastikan tag didekatkan ke perangkat."
        );
        setRfidReading(false);
      }, 15000); // 15 detik timeout untuk KTP

      // Handle successful reading
      ndef.onreading = (event) => {
        clearTimeout(timeoutId);
        console.log("RFID Tag detected:", event);

        // RFID biasanya hanya memiliki serial number tanpa NDEF data
        const serialNumber = event.serialNumber || "Unknown";

        // Coba decode jika ada data
        let rfidData = "";
        let records = [];
        let tagInfo = {
          serialNumber: serialNumber,
          recordCount: 0,
          records: [],
          tagType: "RFID",
          timestamp: new Date().toISOString(),
          atqa: event.atqa || null,
          sak: event.sak || null,
          historicalBytes: event.historicalBytes || null,
          hiLayerResponse: event.hiLayerResponse || null,
          timeout: event.timeout || null,
          extendedLengthApduSupported:
            event.extendedLengthApduSupported || null,
          maxTransceiveLength: event.maxTransceiveLength || null,
          techList: event.techList || null,
          rawEvent: event,
        };

        if (
          event.message &&
          event.message.records &&
          event.message.records.length > 0
        ) {
          const decoder = new TextDecoder();
          tagInfo.recordCount = event.message.records.length;

          for (const [i, record] of event.message.records.entries()) {
            let recordType = record.recordType || "empty";
            let mediaType = record.mediaType || "";
            let data = "";
            let recordInfo = {
              id: i,
              recordType,
              mediaType,
              dataEncoding: record.encoding || "",
              dataSize: record.data ? record.data.byteLength : 0,
              data: "",
            };

            try {
              // Handle different data formats for RFID
              if (record.data) {
                if (recordType === "text") {
                  data = decoder.decode(record.data);
                } else if (recordType === "url") {
                  data = decoder.decode(record.data);
                } else if (
                  recordType === "mime" &&
                  mediaType === "application/json"
                ) {
                  data = decoder.decode(record.data);
                } else {
                  // Try to decode as text, if fails show as hex
                  try {
                    data = decoder.decode(record.data);
                  } catch (e) {
                    // Convert to hex string for binary data
                    const bytes = new Uint8Array(record.data);
                    data = Array.from(bytes, (byte) =>
                      byte.toString(16).padStart(2, "0")
                    ).join(" ");
                  }
                }
              }

              recordInfo.data = data;
              records.push(recordInfo);
              rfidData += data + " ";
            } catch (e) {
              console.warn("Failed to decode RFID record:", e);
              recordInfo.data = "Binary data (decode failed)";
              records.push(recordInfo);
            }
          }
        }

        // Check if this might be a KTP
        const isKTP = checkIfKTP(serialNumber, rfidData, records);

        // Format RFID result - prioritize serial number
        let result = "";
        if (isKTP) {
          result = `KTP Terdeteksi!\nID: ${serialNumber}\nData: ${
            rfidData.trim() || "Data KTP (terenkripsi)"
          }`;
        } else if (rfidData.trim()) {
          result = `RFID Tag ID: ${serialNumber}\nData: ${rfidData.trim()}`;
        } else {
          result = `RFID Tag ID: ${serialNumber} (No readable data)`;
        }

        tagInfo.records = records;
        if (isKTP) {
          tagInfo.tagType = "KTP";
          tagInfo.note = "Kartu Tanda Penduduk terdeteksi";
        }

        setRfidResult(result);
        setRfidHistory((prev) => [result, ...prev]);
        setRfidTagInfo(tagInfo);
        setRfidReading(false);
      };

      // Handle reading errors
      ndef.onerror = (err) => {
        clearTimeout(timeoutId);
        console.error("RFID Error:", err);

        let errorMessage = "Gagal membaca RFID: " + (err?.message || err);

        // Provide more specific error messages
        if (err?.name === "NotAllowedError") {
          errorMessage =
            "Izin RFID ditolak. Silakan izinkan akses NFC di pengaturan browser.";
        } else if (err?.name === "NotSupportedError") {
          errorMessage = "Perangkat tidak mendukung RFID atau NFC tidak aktif.";
        } else if (err?.name === "AbortError") {
          errorMessage = "Scan RFID dibatalkan.";
        }

        setRfidResult(errorMessage);
        setRfidReading(false);
      };

      // Handle reading without NDEF data (for empty tags or KTP)
      ndef.onreadingerror = (err) => {
        clearTimeout(timeoutId);
        console.log("RFID Reading Error (possibly empty tag or KTP):", err);

        // Try to get serial number even if NDEF reading fails
        if (err && err.serialNumber) {
          const isKTP = checkIfKTP(err.serialNumber, "", []);
          let result = "";

          if (isKTP) {
            result = `KTP Terdeteksi!\nID: ${err.serialNumber}\nData: Data KTP (terenkripsi atau tidak dapat dibaca)`;
          } else {
            result = `RFID Tag ID: ${err.serialNumber} (No NDEF data)`;
          }

          setRfidResult(result);
          setRfidHistory((prev) => [result, ...prev]);
          setRfidTagInfo({
            serialNumber: err.serialNumber,
            recordCount: 0,
            records: [],
            tagType: isKTP ? "KTP" : "RFID",
            timestamp: new Date().toISOString(),
            note: isKTP
              ? "KTP terdeteksi tapi data terenkripsi"
              : "Tag detected but no NDEF data found",
            atqa: err.atqa || null,
            sak: err.sak || null,
            historicalBytes: err.historicalBytes || null,
            hiLayerResponse: err.hiLayerResponse || null,
            timeout: err.timeout || null,
            extendedLengthApduSupported:
              err.extendedLengthApduSupported || null,
            maxTransceiveLength: err.maxTransceiveLength || null,
            techList: err.techList || null,
            rawEvent: err,
          });
        } else {
          setRfidResult("Tag terdeteksi tapi tidak dapat membaca data");
        }
        setRfidReading(false);
      };
    } catch (err) {
      console.error("RFID Scan Error:", err);
      setRfidResult("Gagal memulai scan RFID: " + (err?.message || err));
      setRfidReading(false);
    }
  };

  // Universal scan function based on mode
  const handleScan = async () => {
    if (scanMode === "nfc") {
      await handleScanNfc();
    } else if (scanMode === "rfid") {
      await handleScanRfid();
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

  return (
    <div className="bg-gray-100 pb-20 min-h-screen flex flex-col max-w-sm mx-auto rounded-lg shadow-lg overflow-hidden border border-gray-200">
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
            onScan={handleScan}
            scanMode={scanMode}
            setScanMode={setScanMode}
            nfcResult={nfcResult}
            nfcHistory={nfcHistory}
            nfcSupported={nfcSupported}
            nfcReading={nfcReading}
            nfcTagInfo={nfcTagInfo}
            rfidResult={rfidResult}
            rfidHistory={rfidHistory}
            rfidReading={rfidReading}
            rfidTagInfo={rfidTagInfo}
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
