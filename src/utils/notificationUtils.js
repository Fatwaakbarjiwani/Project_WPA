// Utility untuk mengelola notifikasi push

// Fungsi untuk mengirim notifikasi push
export const sendPushNotification = async (subscription, payload) => {
  try {
    const response = await fetch("/api/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subscription,
        payload,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send push notification");
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending push notification:", error);
    throw error;
  }
};

// Fungsi untuk mengirim notifikasi ke semua subscriber
export const sendNotificationToAll = async (payload) => {
  try {
    const response = await fetch("/api/push/broadcast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to send broadcast notification");
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending broadcast notification:", error);
    throw error;
  }
};

// Fungsi untuk membuat payload notifikasi
export const createNotificationPayload = (type, data) => {
  const basePayload = {
    title: "MarketPlay",
    icon: "/vite.svg",
    badge: "/vite.svg",
    tag: `marketplay-${type}`,
    requireInteraction: true,
    vibrate: [200, 100, 200],
    data: {
      url: "/",
      type,
      ...data,
    },
  };

  switch (type) {
    case "new_product":
      return {
        ...basePayload,
        title: "Barang Baru!",
        body: `${data.productName} sudah tersedia di MarketPlay`,
        actions: [
          {
            action: "view",
            title: "Lihat Produk",
            icon: "/vite.svg",
          },
        ],
      };

    case "flash_sale":
      return {
        ...basePayload,
        title: "Flash Sale!",
        body: `Diskon hingga ${data.discount}% untuk ${data.category}`,
        actions: [
          {
            action: "view",
            title: "Lihat Sale",
            icon: "/vite.svg",
          },
        ],
      };

    case "order_update":
      return {
        ...basePayload,
        title: "Update Pesanan",
        body: `Pesanan #${data.orderId} ${data.status}`,
        actions: [
          {
            action: "view",
            title: "Lihat Pesanan",
            icon: "/vite.svg",
          },
        ],
      };

    case "app_update":
      return {
        ...basePayload,
        title: "Update Tersedia!",
        body: "Versi baru MarketPlay sudah tersedia",
        actions: [
          {
            action: "update",
            title: "Update Sekarang",
            icon: "/vite.svg",
          },
        ],
      };

    default:
      return {
        ...basePayload,
        title: data.title || "MarketPlay",
        body: data.body || "Ada update baru di aplikasi!",
        actions: [
          {
            action: "view",
            title: "Lihat",
            icon: "/vite.svg",
          },
        ],
      };
  }
};

// Fungsi untuk mengecek apakah notifikasi didukung
export const isNotificationSupported = () => {
  return (
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window
  );
};

// Fungsi untuk mendapatkan permission notifikasi
export const getNotificationPermission = () => {
  if (!isNotificationSupported()) {
    return "unsupported";
  }
  return Notification.permission;
};

// Fungsi untuk meminta izin notifikasi
export const requestNotificationPermission = async () => {
  if (!isNotificationSupported()) {
    throw new Error("Notifications not supported");
  }

  const permission = await Notification.requestPermission();
  return permission;
};

// Fungsi untuk menampilkan notifikasi lokal
export const showLocalNotification = async (payload) => {
  if (getNotificationPermission() !== "granted") {
    throw new Error("Notification permission not granted");
  }

  const registration = await navigator.serviceWorker.ready;
  await registration.showNotification(payload.title, {
    body: payload.body,
    icon: payload.icon,
    badge: payload.badge,
    tag: payload.tag,
    data: payload.data,
    actions: payload.actions,
    requireInteraction: payload.requireInteraction,
    vibrate: payload.vibrate,
  });
};

// Fungsi untuk mengecek koneksi internet
export const isOnline = () => {
  return navigator.onLine;
};

// Fungsi untuk mendengarkan perubahan koneksi
export const onConnectionChange = (callback) => {
  window.addEventListener("online", () => callback(true));
  window.addEventListener("offline", () => callback(false));
};

// Fungsi untuk menyimpan notifikasi ke localStorage
export const saveNotificationToStorage = (notification) => {
  try {
    const notifications = JSON.parse(
      localStorage.getItem("marketplay_notifications") || "[]"
    );
    notifications.unshift({
      ...notification,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    });

    // Batasi hanya 50 notifikasi terakhir
    if (notifications.length > 50) {
      notifications.splice(50);
    }

    localStorage.setItem(
      "marketplay_notifications",
      JSON.stringify(notifications)
    );
  } catch (error) {
    console.error("Error saving notification to storage:", error);
  }
};

// Fungsi untuk mengambil notifikasi dari localStorage
export const getNotificationsFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem("marketplay_notifications") || "[]");
  } catch (error) {
    console.error("Error getting notifications from storage:", error);
    return [];
  }
};

// Fungsi untuk menghapus notifikasi dari localStorage
export const removeNotificationFromStorage = (notificationId) => {
  try {
    const notifications = getNotificationsFromStorage();
    const filteredNotifications = notifications.filter(
      (n) => n.id !== notificationId
    );
    localStorage.setItem(
      "marketplay_notifications",
      JSON.stringify(filteredNotifications)
    );
  } catch (error) {
    console.error("Error removing notification from storage:", error);
  }
};
