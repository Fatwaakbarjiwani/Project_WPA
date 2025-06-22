import { useState, useEffect } from "react";
import { BellIcon, BellSlashIcon } from "@heroicons/react/24/outline";

const NotificationManager = () => {
  const [permission, setPermission] = useState("default");
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      
      // Check existing subscription
      checkExistingSubscription();
    }
  };

  const checkExistingSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        setSubscription(existingSubscription);
        console.log("Existing subscription found:", existingSubscription);
      }
    } catch (error) {
      console.log("No existing subscription found");
    }
  };

  const requestPermission = async () => {
    if (!isSupported) {
      setError("Browser Anda tidak mendukung notifikasi push");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");
    
    try {
      console.log("Requesting notification permission...");
      const result = await Notification.requestPermission();
      console.log("Permission result:", result);
      setPermission(result);
      
      if (result === "granted") {
        setSuccess("Izin notifikasi diberikan!");
        await registerServiceWorker();
        await subscribeToPush();
      } else if (result === "denied") {
        setError("Izin notifikasi ditolak. Silakan aktifkan di pengaturan browser.");
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      setError("Gagal mengaktifkan notifikasi: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const registerServiceWorker = async () => {
    try {
      console.log("Registering service worker...");
      const registration = await navigator.serviceWorker.register("/sw.js");
      console.log("Service Worker registered successfully:", registration);
      return registration;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
      throw new Error("Gagal mendaftarkan Service Worker: " + error.message);
    }
  };

  const subscribeToPush = async () => {
    try {
      console.log("Getting service worker registration...");
      const registration = await navigator.serviceWorker.ready;
      console.log("Service worker ready:", registration);
      
      // Check if already subscribed
      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        console.log("Already subscribed, using existing subscription");
        setSubscription(existingSubscription);
        setSuccess("Notifikasi sudah aktif!");
        return;
      }
      
      console.log("Creating new push subscription...");
      
      // Generate VAPID keys using the script
      // For now, using a sample key - you should generate your own
      const vapidPublicKey = "BEl62iUYgUivxIkv69yViEuiBIa1HlVbB8y8ewBwzKk";
      
      // Convert VAPID key to Uint8Array
      const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
      
      console.log("Subscribing with application server key...");
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
      });

      console.log("Push subscription created successfully:", newSubscription);
      setSubscription(newSubscription);
      setSuccess("Berhasil berlangganan notifikasi push!");
      
      // Send subscription to server (optional for now)
      await sendSubscriptionToServer(newSubscription);
      
    } catch (error) {
      console.error("Error subscribing to push:", error);
      
      // Handle specific errors
      if (error.name === "NotAllowedError") {
        throw new Error("Izin notifikasi ditolak oleh browser");
      } else if (error.name === "NotSupportedError") {
        throw new Error("Browser tidak mendukung push notifications");
      } else if (error.name === "InvalidStateError") {
        throw new Error("Sudah berlangganan notifikasi");
      } else if (error.name === "AbortError") {
        throw new Error("Operasi dibatalkan");
      } else if (error.name === "TypeError" && error.message.includes("applicationServerKey")) {
        throw new Error("VAPID key tidak valid");
      } else {
        throw new Error("Gagal berlangganan notifikasi: " + error.message);
      }
    }
  };

  const sendSubscriptionToServer = async (subscription) => {
    try {
      console.log("Sending subscription to server...");
      
      // In real app, you would send this to your backend
      // const response = await fetch('/api/push/subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(subscription)
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to send subscription to server');
      // }
      
      console.log("Subscription sent to server successfully");
    } catch (error) {
      console.error("Error sending subscription to server:", error);
      // Don't throw error here as subscription is still valid locally
    }
  };

  const unsubscribeFromPush = async () => {
    try {
      if (subscription) {
        console.log("Unsubscribing from push notifications...");
        await subscription.unsubscribe();
        setSubscription(null);
        setSuccess("Berhasil berhenti berlangganan notifikasi");
        console.log("Unsubscribed successfully");
      }
    } catch (error) {
      console.error("Error unsubscribing from push:", error);
      setError("Gagal berhenti berlangganan: " + error.message);
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
      setError("Izin notifikasi belum diberikan");
      return;
    }

    try {
      console.log("Sending test notification...");
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification("Test Notifikasi MarketPlay", {
        body: "Ini adalah notifikasi test dari aplikasi MarketPlay!",
        icon: "/vite.svg",
        badge: "/vite.svg",
        tag: "test-notification",
        requireInteraction: true,
        actions: [
          {
            action: "view",
            title: "Lihat",
            icon: "/vite.svg"
          }
        ],
        data: {
          url: "/",
          type: "test",
          timestamp: Date.now()
        }
      });
      setSuccess("Notifikasi test berhasil dikirim!");
    } catch (error) {
      console.error("Error sending test notification:", error);
      setError("Gagal mengirim notifikasi test: " + error.message);
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

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-green-800">{success}</p>
        </div>
      )}

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

      {/* Debug Info */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <details className="text-xs text-gray-500">
          <summary className="cursor-pointer">Debug Info</summary>
          <div className="mt-2 space-y-1">
            <div>Supported: {isSupported ? 'Yes' : 'No'}</div>
            <div>Permission: {permission}</div>
            <div>Subscription: {subscription ? 'Active' : 'None'}</div>
            <div>Service Worker: {'serviceWorker' in navigator ? 'Available' : 'Not Available'}</div>
            <div>Push Manager: {'PushManager' in window ? 'Available' : 'Not Available'}</div>
            <div>Notification: {'Notification' in window ? 'Available' : 'Not Available'}</div>
          </div>
        </details>
      </div>
    </div>
  );
};

export default NotificationManager;
