# MarketPlay - E-Commerce NFC PWA

MarketPlay adalah aplikasi marketplace Progressive Web App (PWA) dengan fitur NFC dan QR Code scanner yang dirancang mirip dengan Shopee.

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
- **RFID Scanner**: Scan RFID tag untuk identifikasi dan tracking
- **QR Code Scanner**: Scan QR code untuk mencari produk
- **Camera Integration**: Ambil foto produk langsung dari kamera
- **Multiple Camera Support**: Dukungan kamera depan dan belakang
- **Image Upload**: Upload gambar untuk scan QR code

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
- **NFC**: Web NFC API (NDEFReader)
- **RFID**: Web NFC API (NDEFReader)
- **Camera**: MediaDevices API
- **QR Code**: jsQR Library + BarcodeDetector API

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
# Generate VAPID keys
npm run generate-vapid
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

1. Buka halaman Scanner
2. Pilih mode **NFC**
3. Klik "Scan NFC Tag"
4. Dekatkan tag NFC ke perangkat
5. Lihat hasil scan

### Scan RFID

1. Buka halaman Scanner
2. Pilih mode **RFID**
3. Klik "Scan RFID Tag"
4. Dekatkan tag RFID ke perangkat
5. Lihat hasil scan

### Scan QR Code

1. Buka halaman Kamera
2. Pilih mode "QR Code"
3. Pilih salah satu opsi:
   - **Scan QR Code**: Scan manual satu kali
   - **Auto**: Mode scanning otomatis berkelanjutan
   - **Pilih Gambar**: Upload gambar untuk scan QR code
4. Arahkan kamera ke QR code atau upload gambar
5. Lihat hasil scan

### Camera Features

- **Switch Camera**: Ganti antara kamera depan dan belakang
- **Pause/Resume**: Jeda atau lanjutkan stream kamera
- **Photo Mode**: Ambil foto produk
- **Multiple Camera Support**: Otomatis mendeteksi dan memilih kamera terbaik

## 🌟 Fitur QR Code Scanning

### Cara Kerja

1. **Manual Scan**: Ambil frame dari video stream dan scan dengan jsQR
2. **Auto Scan**: Scan berkelanjutan setiap 500ms untuk deteksi otomatis
3. **Image Upload**: Scan QR code dari file gambar yang diupload

### Supported Formats

- QR Code (QR)
- Aztec Code
- Data Matrix
- EAN-13, EAN-8
- UPC-A, UPC-E
- Code 128, Code 39
- PDF417

### Library yang Digunakan

- **jsQR**: Library utama untuk QR code detection (via CDN)
- **BarcodeDetector API**: Fallback untuk browser modern

### Tips Penggunaan QR Code

- Pastikan QR code berada dalam area scanning (kotak orange)
- Gunakan mode **Auto** untuk scanning yang lebih mudah
- Untuk QR code yang sulit, coba upload gambar
- Pastikan pencahayaan cukup
- Jaga kamera tetap stabil

## 🏷️ Fitur RFID Scanning

### Cara Kerja

1. **NDEFReader**: Menggunakan Web NFC API untuk membaca RFID
2. **Serial Number**: Menangkap ID unik tag RFID
3. **Data Parsing**: Parse data NDEF jika tersedia
4. **History Tracking**: Menyimpan riwayat scan RFID

### RFID vs NFC

- **NFC**: Near Field Communication - untuk transfer data dan pembayaran
- **RFID**: Radio Frequency Identification - untuk identifikasi dan tracking

### Supported RFID Types

- **ISO14443 Type A**: MIFARE Classic, MIFARE Ultralight
- **ISO14443 Type B**: Calypso, DESFire
- **ISO15693**: I-CODE, Tag-it
- **FeliCa**: Sony FeliCa

### RFID Features

- **Tag ID Detection**: Menangkap serial number tag
- **NDEF Data Reading**: Membaca data NDEF jika tersedia
- **Tag Information**: Detail lengkap tag (type, size, timestamp)
- **Scan History**: Riwayat scan RFID
- **Real-time Scanning**: Deteksi otomatis saat tag didekatkan

### Tips Penggunaan RFID

- Pastikan tag RFID dalam jarak yang tepat (1-10 cm)
- Beberapa tag RFID mungkin tidak memiliki data NDEF
- Tag ID akan selalu terdeteksi meskipun tidak ada data
- Gunakan Chrome di Android untuk kompatibilitas terbaik

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
│   ├── NFCPage.jsx             # Scanner NFC & RFID
│   ├── CameraPage.jsx          # Kamera & QR code scanning
│   └── ProfilePage.jsx         # Profil pengguna
├── data/
│   ├── products.js             # Data produk
│   └── user.js                 # Data pengguna
├── utils/
│   └── notificationUtils.js    # Utility notifikasi
├── public/
│   ├── sw.js                   # Service Worker
│   └── manifest.json           # PWA Manifest
└── scripts/
    └── generate-vapid-keys.js  # Script generate VAPID keys
```

## 🔍 Troubleshooting

### QR Code tidak terdeteksi

- Pastikan QR code jelas dan tidak blur
- Coba mode **Auto** untuk scanning berkelanjutan
- Pastikan library jsQR sudah terload (cek console)
- Pastikan menggunakan HTTPS atau localhost

### Kamera tidak berfungsi

- Pastikan izin kamera sudah diberikan
- Coba refresh halaman
- Pastikan menggunakan HTTPS atau localhost
- Cek apakah ada aplikasi lain yang menggunakan kamera

### Push Notifications gagal

- Pastikan menggunakan HTTPS
- Cek console untuk error detail
- Pastikan VAPID keys sudah benar
- Pastikan service worker sudah terdaftar

### NFC tidak berfungsi

- Pastikan menggunakan Chrome di Android
- Pastikan menggunakan HTTPS
- Pastikan perangkat mendukung NFC
- Pastikan NFC sudah diaktifkan di pengaturan

### RFID tidak berfungsi

- Pastikan menggunakan Chrome di Android
- Pastikan menggunakan HTTPS
- Pastikan perangkat mendukung NFC/RFID
- Beberapa tag RFID mungkin tidak kompatibel
- Cek jarak antara tag dan perangkat (1-10 cm)

### Multiple Camera Issues

- Pastikan perangkat memiliki lebih dari satu kamera
- Coba refresh halaman untuk mendeteksi ulang kamera
- Pastikan tidak ada aplikasi lain yang menggunakan kamera

## 📄 License

MIT License - lihat file LICENSE untuk detail.

## 🤝 Contributing

1. Fork repository
2. Buat feature branch
3. Commit changes
4. Push ke branch
5. Buat Pull Request

## 📞 Support

Untuk pertanyaan atau masalah, silakan buat issue di repository ini.

---

**MarketPlay** - Belanja lebih mudah dengan NFC dan Barcode Scanner! 🛍️📱
