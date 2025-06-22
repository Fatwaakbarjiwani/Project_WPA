import { useState, useEffect } from "react";
import { BellIcon, BellSlashIcon } from "@heroicons/react/24/outline";

const NotificationManager = () => {
  const [permission, setPermission] = useState("default");
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkNotificationSupport();
  }, []);

  const checkNotificationSupport = () => {
    if (
      "Notification" in window &&
      "serviceWorker" in navigator &&
      "PushManager" in window
    ) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  };

  const requestPermission = async () => {
    if (!isSupported) {
      alert("Browser Anda tidak mendukung notifikasi push");
      return;
    }

    setIsLoading(true);
    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === "granted") {
        await registerServiceWorker();
        await subscribeToPush();
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      alert("Gagal mengaktifkan notifikasi");
    } finally {
      setIsLoading(false);
    }
  };

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      console.log("Service Worker registered:", registration);
      return registration;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
      throw error;
    }
  };

  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;

      // Generate VAPID keys (you should generate these on your server)
      const vapidPublicKey = "BEl62iUYgUivxIkv69yViEuiBIa1HlVbB8y8ewBwzKk";

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      setSubscription(subscription);

      // Send subscription to server
      await sendSubscriptionToServer(subscription);

      console.log("Push subscription created:", subscription);
    } catch (error) {
      console.error("Error subscribing to push:", error);
      throw error;
    }
  };

  const sendSubscriptionToServer = async (subscription) => {
    try {
      // Simulate sending subscription to server
      console.log("Sending subscription to server:", subscription);

      // In real app, you would send this to your backend
      // await fetch('/api/push/subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(subscription)
      // });
    } catch (error) {
      console.error("Error sending subscription to server:", error);
    }
  };

  const unsubscribeFromPush = async () => {
    try {
      if (subscription) {
        await subscription.unsubscribe();
        setSubscription(null);
        console.log("Unsubscribed from push notifications");
      }
    } catch (error) {
      console.error("Error unsubscribing from push:", error);
    }
  };

  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const sendTestNotification = async () => {
    if (permission !== "granted") {
      alert("Izin notifikasi belum diberikan");
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification("Test Notifikasi", {
        body: "Ini adalah notifikasi test dari MarketPlay!",
        icon: "/vite.svg",
        badge: "/vite.svg",
        tag: "test-notification",
        requireInteraction: true,
        actions: [
          {
            action: "view",
            title: "Lihat",
            icon: "/vite.svg",
          },
        ],
      });
    } catch (error) {
      console.error("Error sending test notification:", error);
    }
  };

  const getStatusText = () => {
    if (!isSupported) return "Tidak didukung";
    switch (permission) {
      case "granted":
        return "Diaktifkan";
      case "denied":
        return "Ditolak";
      default:
        return "Belum diatur";
    }
  };

  const getStatusColor = () => {
    switch (permission) {
      case "granted":
        return "text-green-600";
      case "denied":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <BellSlashIcon className="w-5 h-5 text-yellow-600" />
          <span className="text-sm text-yellow-800">
            Browser Anda tidak mendukung notifikasi push
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Notifikasi Push</h3>
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>

      <div className="space-y-3">
        {permission === "default" && (
          <button
            onClick={requestPermission}
            disabled={isLoading}
            className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <BellIcon className="w-5 h-5" />
            {isLoading ? "Mengaktifkan..." : "Aktifkan Notifikasi"}
          </button>
        )}

        {permission === "granted" && (
          <div className="space-y-2">
            <button
              onClick={sendTestNotification}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition"
            >
              Kirim Notifikasi Test
            </button>

            <button
              onClick={unsubscribeFromPush}
              className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition"
            >
              Nonaktifkan Notifikasi
            </button>
          </div>
        )}

        {permission === "denied" && (
          <div className="text-sm text-gray-600">
            <p>Izin notifikasi ditolak. Untuk mengaktifkan:</p>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Klik ikon kunci di address bar</li>
              <li>Ubah izin notifikasi ke "Izinkan"</li>
              <li>Refresh halaman</li>
            </ol>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <h4 className="font-medium text-gray-800 mb-2">Fitur Notifikasi:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Barang baru tersedia</li>
          <li>• Flash sale dan diskon</li>
          <li>• Update aplikasi</li>
          <li>• Status pesanan</li>
        </ul>
      </div>
    </div>
  );
};

export default NotificationManager;
