# Setup Notifikasi Push - MarketPlay PWA

## 🚀 Langkah-langkah Setup

### 1. Generate VAPID Keys

```bash
# Install web-push jika belum
npm install web-push

# Generate VAPID keys
npm run generate-vapid
```

### 2. Update VAPID Public Key

Setelah generate VAPID keys, update file berikut:

#### `src/components/NotificationManager.jsx`

```javascript
// Ganti baris ~80
const vapidPublicKey = "YOUR_GENERATED_PUBLIC_KEY_HERE";
```

### 3. Setup Backend (Opsional)

Untuk notifikasi push yang sebenarnya, Anda perlu backend server:

```javascript
// Contoh endpoint /api/push/subscribe
app.post("/api/push/subscribe", async (req, res) => {
  const subscription = req.body;

  // Simpan subscription ke database
  await saveSubscription(subscription);

  res.json({ success: true });
});

// Contoh endpoint /api/push/send
app.post("/api/push/send", async (req, res) => {
  const { subscription, payload } = req.body;

  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 🔧 Troubleshooting

### Masalah 1: "Browser tidak mendukung notifikasi push"

**Solusi:**

- Pastikan menggunakan HTTPS (required untuk PWA)
- Gunakan browser modern (Chrome, Firefox, Edge)
- Pastikan Service Worker terdaftar dengan benar

### Masalah 2: "Gagal mengaktifkan notifikasi"

**Solusi:**

- Cek console browser untuk error detail
- Pastikan VAPID keys valid
- Coba refresh halaman dan coba lagi

### Masalah 3: Notifikasi tidak muncul saat aplikasi tertutup

**Solusi:**

- Pastikan Service Worker terdaftar
- Cek permission notifikasi di browser
- Pastikan aplikasi diinstall sebagai PWA

### Masalah 4: Klik notifikasi tidak membuka aplikasi

**Solusi:**

- Pastikan URL di notification data benar
- Cek Service Worker event listener
- Pastikan aplikasi sudah diinstall

## 📱 Testing Notifikasi

### 1. Test Lokal

```javascript
// Di browser console
const registration = await navigator.serviceWorker.ready;
await registration.showNotification("Test", {
  body: "Test notification",
  icon: "/vite.svg",
});
```

### 2. Test Push Notification

```javascript
// Simulasi push event
const event = new PushEvent("push", {
  data: JSON.stringify({
    title: "Test Push",
    body: "This is a test push notification",
    type: "test",
  }),
});

// Trigger di service worker
self.dispatchEvent(event);
```

## 🔒 Keamanan

### VAPID Keys

- Jangan share private key
- Gunakan environment variables
- Rotate keys secara berkala

### HTTPS

- Required untuk PWA dan notifikasi
- Gunakan SSL certificate valid
- Redirect HTTP ke HTTPS

## 📊 Monitoring

### Log Notifikasi

```javascript
// Di service worker
self.addEventListener("push", (event) => {
  console.log("Push received:", event.data?.json());
  // Log ke analytics
});
```

### Error Tracking

```javascript
// Track subscription errors
subscription.onerror = (error) => {
  console.error("Subscription error:", error);
  // Send to error tracking service
};
```

## 🎯 Best Practices

1. **Permission Handling**

   - Minta izin di waktu yang tepat
   - Jelaskan manfaat notifikasi
   - Berikan opsi untuk nonaktifkan

2. **Content Strategy**

   - Notifikasi yang relevan
   - Jangan spam user
   - Berikan value yang jelas

3. **Timing**

   - Kirim notifikasi di waktu yang tepat
   - Pertimbangkan timezone user
   - Rate limiting

4. **Testing**
   - Test di berbagai device
   - Test offline scenario
   - Test permission denied

## 📞 Support

Jika mengalami masalah:

1. Cek console browser untuk error
2. Verifikasi VAPID keys
3. Test di browser berbeda
4. Cek Service Worker status
5. Verifikasi HTTPS setup

---

**Catatan:** Notifikasi push memerlukan HTTPS dan browser modern. Pastikan environment development Anda mendukung fitur ini.
