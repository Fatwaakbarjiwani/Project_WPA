import { useEffect, useState } from "react";

function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => setDeferredPrompt(null));
    }
  };

  if (!deferredPrompt) return null;

  return (
    <div className="fixed bottom-6 right-0 flex justify-center z-50">
      <button
        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce"
        onClick={handleInstall}
      >
        Download
      </button>
    </div>
  );
}

export default InstallPrompt;
