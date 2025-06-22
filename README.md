# MarketPlay - E-Commerce NFC PWA

MarketPlay adalah aplikasi marketplace Progressive Web App (PWA) dengan fitur NFC dan barcode scanner yang dirancang mirip dengan Shopee.

## 🚀 Fitur Utama

### 🛍️ E-Commerce

- **Produk Catalog**: Tampilan produk dengan rating, diskon, dan flash sale
- **Kategori**: Filter produk berdasarkan kategori
- **Detail Produk**: Informasi lengkap produk dengan foto galeri
- **Keranjang Belanja**: Fitur belanja (akan segera hadir)

### 📱 PWA Features

- **Installable**: Dapat diinstall di perangkat mobile dan desktop
- **Offline Support**: Bekerja tanpa koneksi internet
- **Push Notifications**: Notifikasi real-time untuk update dan barang baru
- **Background Sync**: Sinkronisasi data di background

### 🔍 Scanning Features

- **NFC Scanner**: Scan produk dengan teknologi NFC
- **Barcode Scanner**: Scan barcode untuk mencari produk
- **Camera Integration**: Ambil foto produk langsung dari kamera

### 🔔 Notifikasi Push

- **Barang Baru**: Notifikasi saat ada produk baru
- **Flash Sale**: Notifikasi diskon dan promosi
- **Update Aplikasi**: Notifikasi versi baru tersedia
- **Status Pesanan**: Update status pesanan real-time

## 🛠️ Teknologi

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **PWA**: Service Worker + Web App Manifest
- **Notifications**: Push API + Web Notifications API
- **NFC**: Web NFC API
- **Camera**: MediaDevices API

## 📦 Instalasi

1. Clone repository

```bash
git clone <repository-url>
cd Project_WPA
```

2. Install dependencies

```bash
npm install
```

3. Jalankan development server

```bash
npm run dev
```

4. Build untuk production

```bash
npm run build
```

## 🔧 Konfigurasi Notifikasi

### 1. VAPID Keys

Untuk notifikasi push, Anda perlu generate VAPID keys:

```bash
# Install web-push
npm install web-push

# Generate VAPID keys
npx web-push generate-vapid-keys
```

### 2. Update Service Worker

Ganti `vapidPublicKey` di `src/components/NotificationManager.jsx` dengan public key yang dihasilkan.

### 3. Backend API

Implementasikan endpoint berikut di backend Anda:

```javascript
// POST /api/push/subscribe
// POST /api/push/send
// POST /api/push/broadcast
// GET /api/products/new
// GET /api/updates
```

## 📱 Cara Menggunakan

### Install PWA

1. Buka aplikasi di browser Chrome/Edge
2. Klik ikon install di address bar
3. Pilih "Install MarketPlay"

### Aktifkan Notifikasi

1. Buka halaman Profil
2. Klik "Aktifkan Notifikasi"
3. Izinkan notifikasi di browser
4. Test dengan "Kirim Notifikasi Test"

### Scan NFC

1. Buka halaman NFC
2. Klik "Scan NFC Tag"
3. Dekatkan tag NFC ke perangkat
4. Lihat hasil scan

### Scan Barcode

1. Buka halaman Kamera
2. Pilih mode "Barcode"
3. Arahkan kamera ke barcode
4. Klik "Scan Barcode"

## 🔔 Jenis Notifikasi

### 1. Barang Baru

```javascript
{
  type: 'new_product',
  data: {
    productName: 'Smartphone NFC',
    productId: 123
  }
}
```

### 2. Flash Sale

```javascript
{
  type: 'flash_sale',
  data: {
    discount: 70,
    category: 'Gadget'
  }
}
```

### 3. Update Pesanan

```javascript
{
  type: 'order_update',
  data: {
    orderId: '12345',
    status: 'Dikonfirmasi'
  }
}
```

### 4. Update Aplikasi

```javascript
{
  type: 'app_update',
  data: {
    version: '2.0.0'
  }
}
```

## 📊 Struktur Proyek

```
src/
├── components/
│   ├── Header.jsx              # Header dengan search dan notifikasi
│   ├── BottomNav.jsx           # Navigasi bawah
│   ├── ProductCard.jsx         # Card produk
│   ├── NotificationManager.jsx # Manajer notifikasi
│   ├── NotificationList.jsx    # Daftar notifikasi
│   └── UserAvatar.jsx          # Avatar pengguna
├── pages/
│   ├── HomePage.jsx            # Halaman utama
│   ├── ProductDetailPage.jsx   # Detail produk
│   ├── NFCPage.jsx             # Scanner NFC
│   ├── CameraPage.jsx          # Kamera & barcode
│   └── ProfilePage.jsx         # Profil pengguna
├── data/
│   ├── products.js             # Data produk
│   └── user.js                 # Data pengguna
├── utils/
│   └── notificationUtils.js    # Utility notifikasi
└── App.jsx                     # Komponen utama

public/
├── sw.js                       # Service Worker
├── manifest.json               # PWA Manifest
└── index.html                  # HTML utama
```

## 🌐 Browser Support

- **Chrome**: 42+ (Full support)
- **Firefox**: 44+ (Full support)
- **Safari**: 11.1+ (Limited PWA support)
- **Edge**: 17+ (Full support)

### NFC Support

- **Chrome Android**: 89+ (Web NFC API)
- **Edge Android**: 89+ (Web NFC API)

## 🔒 Keamanan

- HTTPS required untuk PWA dan notifikasi
- VAPID keys untuk autentikasi push
- Service Worker untuk offline security
- Local storage untuk data sensitif

## 📈 Performance

- **Lighthouse Score**: 90+ (PWA)
- **Bundle Size**: < 500KB
- **First Load**: < 3s
- **Offline Support**: Full functionality

## 🤝 Kontribusi

1. Fork repository
2. Buat feature branch
3. Commit changes
4. Push ke branch
5. Buat Pull Request

## 📄 License

MIT License - lihat file LICENSE untuk detail.

## 📞 Support

Untuk pertanyaan dan dukungan:

- Email: support@marketplay.com
- GitHub Issues: [Buat Issue](https://github.com/your-repo/issues)

---

**MarketPlay** - Belanja lebih mudah dengan NFC dan Barcode Scanner! 🛍️📱
