const NFCPage = ({
  onBack,
  onScan,
  nfcResult,
  nfcHistory,
  nfcSupported,
  nfcReading,
  nfcTagInfo,
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
    {/* NFC Tag Info */}
    {nfcTagInfo && (
      <div className="border rounded-lg p-3 mb-4 bg-gray-50">
        <div className="font-semibold mb-2">NFC Tag Info</div>
        <div className="flex flex-col gap-1 text-sm mb-2">
          <div>
            <span className="font-medium">Serial Number:</span>{" "}
            {nfcTagInfo.serialNumber}
          </div>
          <div>
            <span className="font-medium">Record Count:</span>{" "}
            {nfcTagInfo.recordCount}
          </div>
        </div>
        {nfcTagInfo.records.map((rec, i) => (
          <div key={i} className="border-t pt-2 mt-2">
            <div className="font-semibold mb-1">Record {i}</div>
            <div className="text-xs">
              <div>
                <span className="font-medium">Record ID:</span> {rec.id}
              </div>
              <div>
                <span className="font-medium">Record Type:</span>{" "}
                {rec.recordType || "empty"}
              </div>
              <div>
                <span className="font-medium">Media Type:</span>{" "}
                {rec.mediaType || "-"}
              </div>
              <div>
                <span className="font-medium">Data Encoding:</span>{" "}
                {rec.dataEncoding || "-"}
              </div>
              <div>
                <span className="font-medium">Data Size:</span> {rec.dataSize}{" "}
                bytes
              </div>
              <div>
                <span className="font-medium">Data:</span> {rec.data || "-"}
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
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
