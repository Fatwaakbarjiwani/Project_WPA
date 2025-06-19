import {
  HomeIcon,
  QrCodeIcon,
  CameraIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const navs = [
  { key: "home", label: "Home", icon: HomeIcon },
  { key: "nfc", label: "NFC", icon: QrCodeIcon },
  { key: "camera", label: "Kamera", icon: CameraIcon },
  { key: "profile", label: "Profil", icon: UserCircleIcon },
];

const BottomNav = ({ page, setPage }) => (
  <nav className="fixed bottom-0 w-full flex justify-around bg-white border-t border-gray-200 py-2">
    {navs.map(({ key, label, icon: Icon }) => (
      <button
        key={key}
        className={`flex flex-col items-center flex-1 py-1 rounded-lg mx-1 font-medium transition text-xs ${
          page === key
            ? "bg-blue-600 text-white"
            : "text-gray-600 hover:bg-blue-50"
        }`}
        onClick={() => setPage(key)}
      >
        <Icon className="w-6 h-6 mb-0.5" />
        {label}
      </button>
    ))}
  </nav>
);

export default BottomNav;
