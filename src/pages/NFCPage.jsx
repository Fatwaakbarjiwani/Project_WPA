import {
  ArrowLeftIcon,
  QrCodeIcon,
  WifiIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";

const NFCPage = ({
  onBack,
  onScan,
  nfcResult,
  nfcHistory,
  nfcSupported,
  nfcReading,
  nfcTagInfo,
}) => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-orange-500 text-white px-4 py-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-orange-600 transition"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold">NFC Scanner</h1>
        <div className="w-10"></div>
      </div>

      {/* NFC Status */}
      <div className="px-4 py-4">
        <div
          className={`rounded-lg p-4 mb-4 ${
            nfcSupported
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <QrCodeIcon
              className={`w-6 h-6 ${
                nfcSupported ? "text-green-600" : "text-red-600"
              }`}
            />
            <div>
              <div className="font-medium text-sm">
                {nfcSupported ? "NFC Tersedia" : "NFC Tidak Tersedia"}
              </div>
              <div className="text-xs text-gray-600">
                {nfcSupported
                  ? "Perangkat Anda mendukung NFC"
                  : "Gunakan Chrome di Android untuk NFC"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scan Button */}
      <div className="px-4 py-4">
        <button
          onClick={onScan}
          disabled={!nfcSupported || nfcReading}
          className={`w-full py-4 rounded-lg font-medium transition flex items-center justify-center gap-3 ${
            nfcSupported && !nfcReading
              ? "bg-orange-500 text-white hover:bg-orange-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <QrCodeIcon className="w-6 h-6" />
          {nfcReading ? "Scanning NFC..." : "Scan NFC Tag"}
        </button>
      </div>

      {/* Current Result */}
      {nfcResult && (
        <div className="px-4 py-4">
          <h3 className="font-medium text-gray-800 mb-3">
            Hasil Scan Terakhir
          </h3>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-600 mb-2">Data NFC:</div>
            <div className="font-medium text-gray-800">{nfcResult}</div>

            {nfcTagInfo && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>Serial Number: {nfcTagInfo.serialNumber}</div>
                  <div>Records: {nfcTagInfo.recordCount}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* NFC Features */}
      <div className="px-4 py-4">
        <h3 className="font-medium text-gray-800 mb-3">Fitur NFC</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCardIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-sm">Pembayaran</div>
                <div className="text-xs text-gray-500">Tap to pay</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <WifiIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="font-medium text-sm">Koneksi</div>
                <div className="text-xs text-gray-500">Quick connect</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History */}
      {nfcHistory.length > 0 && (
        <div className="px-4 py-4">
          <h3 className="font-medium text-gray-800 mb-3">Riwayat Scan</h3>
          <div className="space-y-2">
            {nfcHistory.slice(0, 5).map((result, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-3 border border-gray-200"
              >
                <div className="text-sm text-gray-800">{result}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date().toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NFCPage;
