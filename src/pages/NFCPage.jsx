const NFCPage = ({
  onBack,
  onScan,
  nfcResult,
  nfcHistory,
  nfcSupported,
  nfcReading,
}) => (
  <div className="px-4 py-3">
    <button className="mb-3 text-blue-600 font-medium" onClick={onBack}>
      &larr; Kembali
    </button>
    <h2 className="text-xl font-bold mb-2">Scan NFC Produk</h2>
    {!nfcSupported && (
      <p className="text-red-500 mb-4">Browser tidak mendukung Web NFC.</p>
    )}
    {nfcSupported && (
      <button
        className="bg-blue-600 text-white rounded-lg px-4 py-2 font-medium shadow hover:bg-blue-700 transition mb-2"
        onClick={onScan}
        disabled={nfcReading}
      >
        {nfcReading ? "Scanning..." : "Mulai Scan NFC"}
      </button>
    )}
    <div className="mb-4 min-h-6">
      {nfcReading && (
        <div className="text-blue-600 font-semibold">
          Sedang scanning NFC...
        </div>
      )}
      {nfcResult && (
        <div
          className={`mt-1 font-semibold ${
            nfcResult.startsWith("Gagal") || nfcResult.startsWith("Browser")
              ? "text-red-600"
              : nfcResult.startsWith("Tidak ada")
              ? "text-yellow-600"
              : "text-green-700"
          }`}
        >
          {nfcResult}
        </div>
      )}
    </div>
    <div>
      <div className="font-semibold mb-2">Riwayat Scan NFC</div>
      <ul className="text-sm text-gray-700">
        {nfcHistory.length === 0 && (
          <li className="text-gray-400">Belum ada riwayat.</li>
        )}
        {nfcHistory.map((item, i) => (
          <li key={i} className="mb-1">
            {item}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default NFCPage;
