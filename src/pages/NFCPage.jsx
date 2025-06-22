import { useState } from "react";
import {
  ArrowLeftIcon,
  QrCodeIcon,
  WifiIcon,
  CreditCardIcon,
  ClockIcon,
  InformationCircleIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

const NFCPage = ({
  onBack,
  onScan,
  scanMode,
  setScanMode,
  nfcResult,
  nfcHistory,
  nfcSupported,
  nfcReading,
  nfcTagInfo,
  rfidResult,
  rfidHistory,
  rfidReading,
  rfidTagInfo,
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const [showTagInfo, setShowTagInfo] = useState(false);

  // Get current result and history based on mode
  const currentResult = scanMode === "nfc" ? nfcResult : rfidResult;
  const currentHistory = scanMode === "nfc" ? nfcHistory : rfidHistory;
  const currentReading = scanMode === "nfc" ? nfcReading : rfidReading;
  const currentTagInfo = scanMode === "nfc" ? nfcTagInfo : rfidTagInfo;

  const handleScanClick = () => {
    onScan();
  };

  const getTagTypeIcon = () => {
    return scanMode === "nfc" ? (
      <QrCodeIcon className="w-6 h-6" />
    ) : (
      <TagIcon className="w-6 h-6" />
    );
  };

  const getTagTypeName = () => {
    return scanMode === "nfc" ? "NFC" : "RFID";
  };

  const getTagTypeDescription = () => {
    return scanMode === "nfc"
      ? "Near Field Communication - untuk transfer data dan pembayaran"
      : "Radio Frequency Identification - untuk identifikasi dan tracking";
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between shadow-sm">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold">Scanner</h1>
        <div className="w-10"></div>
      </div>

      {/* Mode Selector */}
      <div className="bg-white px-4 py-3 border-b">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setScanMode("nfc")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition ${
              scanMode === "nfc"
                ? "bg-orange-500 text-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <QrCodeIcon className="w-4 h-4" />
            NFC
          </button>
          <button
            onClick={() => setScanMode("rfid")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition ${
              scanMode === "rfid"
                ? "bg-orange-500 text-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <TagIcon className="w-4 h-4" />
            RFID
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 space-y-4">
        {/* Info Card */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            {getTagTypeIcon()}
            <div>
              <h3 className="font-semibold text-gray-800">
                {getTagTypeName()} Scanner
              </h3>
              <p className="text-sm text-gray-600">{getTagTypeDescription()}</p>
            </div>
          </div>

          {!nfcSupported && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <InformationCircleIcon className="w-5 h-5 text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  Browser tidak mendukung {getTagTypeName()}. Gunakan Chrome di
                  Android.
                </span>
              </div>
            </div>
          )}

          {/* KTP Scanning Tips */}
          <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <CreditCardIcon className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Tips Scan KTP:
              </span>
            </div>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Pastikan NFC aktif di pengaturan perangkat</li>
              <li>• Dekatkan KTP ke bagian belakang smartphone</li>
              <li>• Tahan posisi selama 2-3 detik</li>
              <li>• Data KTP mungkin terenkripsi dan tidak dapat dibaca</li>
              <li>• Hanya ID chip yang akan terdeteksi</li>
            </ul>
          </div>
        </div>

        {/* Scan Button */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <button
            onClick={handleScanClick}
            disabled={!nfcSupported || currentReading}
            className="w-full bg-orange-500 text-white py-4 rounded-lg font-medium hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            <WifiIcon className="w-6 h-6" />
            {currentReading
              ? `Scanning ${getTagTypeName()}...`
              : `Scan ${getTagTypeName()} Tag`}
          </button>

          {currentReading && (
            <div className="mt-4 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
              <p className="text-sm text-gray-600 mt-2">
                Dekatkan tag {getTagTypeName()} ke perangkat...
              </p>
            </div>
          )}
        </div>

        {/* Result */}
        {currentResult && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">Hasil Scan</h3>

            {/* KTP Detection */}
            {currentResult.includes("KTP Terdeteksi") && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                <div className="flex items-center gap-2">
                  <CreditCardIcon className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    KTP Berhasil Terdeteksi!
                  </span>
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-3">
              <pre className="text-gray-800 break-all whitespace-pre-wrap text-sm">
                {currentResult}
              </pre>
            </div>

            {/* Tag Info Button */}
            {currentTagInfo && (
              <button
                onClick={() => setShowTagInfo(!showTagInfo)}
                className="mt-3 text-orange-500 text-sm font-medium hover:text-orange-600 flex items-center gap-1"
              >
                <InformationCircleIcon className="w-4 h-4" />
                Detail Tag {currentTagInfo.tagType === "KTP" ? "KTP" : ""}
              </button>
            )}
          </div>
        )}

        {/* Tag Info Modal */}
        {showTagInfo && currentTagInfo && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">
              Informasi {currentTagInfo.tagType === "KTP" ? "KTP" : "Tag"}
            </h3>

            {currentTagInfo.tagType === "KTP" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                <div className="flex items-center gap-2">
                  <CreditCardIcon className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Kartu Tanda Penduduk
                  </span>
                </div>
                <p className="text-xs text-blue-700 mt-1">
                  Data KTP biasanya terenkripsi untuk keamanan. Hanya ID chip
                  yang dapat dibaca.
                </p>
              </div>
            )}

            <div className="space-y-2 text-sm">
              {/* FIELD KHUSUS NFC/RFID ADVANCED */}
              <div className="mb-2">
                <div className="font-semibold text-gray-700 mb-1">
                  Info Teknis Tag
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  <div>Tag type</div>
                  <div className="font-mono text-gray-800">
                    {currentTagInfo.tagType || "Tidak tersedia di browser"}
                  </div>
                  <div>Technologies available</div>
                  <div className="font-mono text-gray-800">
                    {currentTagInfo.techList
                      ? Array.isArray(currentTagInfo.techList)
                        ? currentTagInfo.techList.join(", ")
                        : currentTagInfo.techList
                      : "Tidak tersedia di browser"}
                  </div>
                  <div>Serial number</div>
                  <div className="font-mono text-gray-800">
                    {currentTagInfo.serialNumber || "Tidak tersedia di browser"}
                  </div>
                  <div>ATQA</div>
                  <div className="font-mono text-gray-800">
                    {currentTagInfo.atqa !== undefined &&
                    currentTagInfo.atqa !== null
                      ? currentTagInfo.atqa
                      : "Tidak tersedia di browser"}
                  </div>
                  <div>SAK</div>
                  <div className="font-mono text-gray-800">
                    {currentTagInfo.sak !== undefined &&
                    currentTagInfo.sak !== null
                      ? currentTagInfo.sak
                      : "Tidak tersedia di browser"}
                  </div>
                  <div>historicalBytes</div>
                  <div className="font-mono text-gray-800">
                    {currentTagInfo.historicalBytes !== undefined &&
                    currentTagInfo.historicalBytes !== null
                      ? JSON.stringify(currentTagInfo.historicalBytes)
                      : "Tidak tersedia di browser"}
                  </div>
                  <div>hiLayerResponse</div>
                  <div className="font-mono text-gray-800">
                    {currentTagInfo.hiLayerResponse !== undefined &&
                    currentTagInfo.hiLayerResponse !== null
                      ? JSON.stringify(currentTagInfo.hiLayerResponse)
                      : "Tidak tersedia di browser"}
                  </div>
                  <div>timeout</div>
                  <div className="font-mono text-gray-800">
                    {currentTagInfo.timeout !== undefined &&
                    currentTagInfo.timeout !== null
                      ? currentTagInfo.timeout
                      : "Tidak tersedia di browser"}
                  </div>
                  <div>extendedLengthApduSupported</div>
                  <div className="font-mono text-gray-800">
                    {currentTagInfo.extendedLengthApduSupported !== undefined &&
                    currentTagInfo.extendedLengthApduSupported !== null
                      ? String(currentTagInfo.extendedLengthApduSupported)
                      : "Tidak tersedia di browser"}
                  </div>
                  <div>maxTransceiveLength</div>
                  <div className="font-mono text-gray-800">
                    {currentTagInfo.maxTransceiveLength !== undefined &&
                    currentTagInfo.maxTransceiveLength !== null
                      ? currentTagInfo.maxTransceiveLength
                      : "Tidak tersedia di browser"}
                  </div>
                </div>
              </div>
              {/* END FIELD KHUSUS NFC/RFID ADVANCED */}
              <div className="flex justify-between">
                <span className="text-gray-600">Record Count:</span>
                <span className="text-gray-800">
                  {currentTagInfo.recordCount}
                </span>
              </div>
              {currentTagInfo.tagType && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Tag Type:</span>
                  <span className="text-gray-800">
                    {currentTagInfo.tagType}
                  </span>
                </div>
              )}
              {currentTagInfo.timestamp && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Timestamp:</span>
                  <span className="text-gray-800">
                    {new Date(currentTagInfo.timestamp).toLocaleString()}
                  </span>
                </div>
              )}
              {currentTagInfo.note && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                  <span className="text-xs text-yellow-800">
                    {currentTagInfo.note}
                  </span>
                </div>
              )}

              {/* Records */}
              {currentTagInfo.records && currentTagInfo.records.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-800 mb-2">Records:</h4>
                  <div className="space-y-2">
                    {currentTagInfo.records.map((record, index) => (
                      <div key={index} className="bg-gray-50 rounded p-2">
                        <div className="text-xs text-gray-600">
                          Record {record.id}
                        </div>
                        <div className="text-sm">
                          <div>Type: {record.recordType}</div>
                          <div>Media: {record.mediaType || "N/A"}</div>
                          <div>Size: {record.dataSize} bytes</div>
                          <div className="mt-1">
                            <span className="text-gray-600">Data:</span>
                            <pre className="text-xs bg-white p-1 rounded mt-1 overflow-x-auto">
                              {record.data || "Empty"}
                            </pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* History */}
        {currentHistory.length > 0 && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Riwayat Scan</h3>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="text-orange-500 text-sm font-medium hover:text-orange-600 flex items-center gap-1"
              >
                <ClockIcon className="w-4 h-4" />
                {showHistory ? "Sembunyikan" : "Tampilkan"}
              </button>
            </div>

            {showHistory && (
              <div className="space-y-2">
                {currentHistory.slice(0, 5).map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-800 text-sm break-all">{item}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NFCPage;
