import {
  HomeIcon,
  QrCodeIcon,
  CameraIcon,
  UserCircleIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  QrCodeIcon as QrCodeIconSolid,
  CameraIcon as CameraIconSolid,
  UserCircleIcon as UserCircleIconSolid,
  ShoppingBagIcon as ShoppingBagIconSolid,
} from "@heroicons/react/24/solid";

const navs = [
  { key: "home", label: "Home", icon: HomeIcon, iconSolid: HomeIconSolid },
  { key: "nfc", label: "NFC", icon: QrCodeIcon, iconSolid: QrCodeIconSolid },
  {
    key: "camera",
    label: "Scan",
    icon: CameraIcon,
    iconSolid: CameraIconSolid,
  },
  {
    key: "profile",
    label: "Profil",
    icon: UserCircleIcon,
    iconSolid: UserCircleIconSolid,
  },
];

const BottomNav = ({ page, setPage }) => (
  <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm flex justify-around bg-white border-t border-gray-200 py-2 shadow-lg">
    {navs.map(({ key, label, icon: Icon, iconSolid: IconSolid }) => {
      const isActive = page === key;
      const ActiveIcon = isActive ? IconSolid : Icon;

      return (
        <button
          key={key}
          className={`flex flex-col items-center flex-1 py-1 rounded-lg mx-1 font-medium transition text-xs ${
            isActive ? "text-orange-500" : "text-gray-600 hover:text-orange-400"
          }`}
          onClick={() => setPage(key)}
        >
          <ActiveIcon
            className={`w-6 h-6 mb-1 ${isActive ? "text-orange-500" : ""}`}
          />
          {label}
        </button>
      );
    })}
  </nav>
);

export default BottomNav;
