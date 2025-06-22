const CACHE_NAME = "marketplay-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/static/js/bundle.js",
  "/static/css/main.css",
];

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

// Push notification event
self.addEventListener("push", (event) => {
  console.log("Push event received:", event);

  let notificationData = {
    title: "MarketPlay",
    body: "Ada update baru di aplikasi!",
    icon: "/vite.svg",
    badge: "/vite.svg",
    tag: "marketplay-notification",
    data: {
      url: "/",
    },
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        ...notificationData,
        ...data,
      };
    } catch (error) {
      console.error("Error parsing push data:", error);
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      data: notificationData.data,
      actions: [
        {
          action: "view",
          title: "Lihat",
          icon: "/vite.svg",
        },
        {
          action: "close",
          title: "Tutup",
          icon: "/vite.svg",
        },
      ],
      requireInteraction: true,
      vibrate: [200, 100, 200],
    })
  );
});

// Notification click event
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event);

  event.notification.close();

  if (event.action === "close") {
    return;
  }

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      // Check if app is already open
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.focus();
        }
      }

      // Open app if not already open
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data?.url || "/");
      }
    })
  );
});

// Background sync event
self.addEventListener("sync", (event) => {
  console.log("Background sync event:", event);

  if (event.tag === "check-new-products") {
    event.waitUntil(checkForNewProducts());
  }
});

// Function to check for new products
async function checkForNewProducts() {
  try {
    // Simulate API call to check for new products
    const response = await fetch("/api/products/new");
    const newProducts = await response.json();

    if (newProducts.length > 0) {
      await self.registration.showNotification("Barang Baru!", {
        body: `Ada ${newProducts.length} produk baru di MarketPlay`,
        icon: "/vite.svg",
        badge: "/vite.svg",
        tag: "new-products",
        data: {
          url: "/",
          products: newProducts,
        },
        actions: [
          {
            action: "view",
            title: "Lihat Produk",
            icon: "/vite.svg",
          },
        ],
        requireInteraction: true,
      });
    }
  } catch (error) {
    console.error("Error checking for new products:", error);
  }
}

// Periodic background sync (if supported)
self.addEventListener("periodicsync", (event) => {
  console.log("Periodic sync event:", event);

  if (event.tag === "check-updates") {
    event.waitUntil(checkForUpdates());
  }
});

// Function to check for app updates
async function checkForUpdates() {
  try {
    // Simulate checking for app updates
    const response = await fetch("/api/updates");
    const updates = await response.json();

    if (updates.hasUpdate) {
      await self.registration.showNotification("Update Tersedia!", {
        body: "Versi baru MarketPlay sudah tersedia",
        icon: "/vite.svg",
        badge: "/vite.svg",
        tag: "app-update",
        data: {
          url: "/",
          version: updates.version,
        },
        actions: [
          {
            action: "update",
            title: "Update Sekarang",
            icon: "/vite.svg",
          },
        ],
        requireInteraction: true,
      });
    }
  } catch (error) {
    console.error("Error checking for updates:", error);
  }
}
