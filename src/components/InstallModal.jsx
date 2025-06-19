import { useEffect, useState } from "react";

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

function InstallModal() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isStandalone()) return; // Jangan tampilkan modal jika sudah install
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowModal(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null);
        setShowModal(false);
      });
    }
  };

  const handleContinueWeb = () => {
    setShowModal(false);
  };

  if (!showModal || isStandalone()) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg text-center max-w-xs w-full">
        <h2 className="text-lg font-bold mb-2">Install Aplikasi</h2>
        <p className="mb-4 text-sm text-gray-600">
          Agar lebih mudah diakses, install aplikasi ini di perangkat Anda.
        </p>
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition mb-2 w-full"
          onClick={handleInstall}
        >
          Install Sekarang
        </button>
        <button
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition w-full"
          onClick={handleContinueWeb}
        >
          Lanjutkan versi web
        </button>
      </div>
    </div>
  );
}

export default InstallModal;
