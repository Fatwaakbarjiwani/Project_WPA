import {
  MagnifyingGlassIcon,
  BellIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import UserAvatar from "./UserAvatar";

const Header = ({ title, onSearch, onNotification, onCart }) => (
  <header className="bg-orange-500 text-white shadow-lg">
    {/* Top bar */}
    <div className="flex items-center justify-between px-4 py-2">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <span className="text-orange-500 font-bold text-sm">M</span>
        </div>
        <h1 className="text-lg font-bold tracking-wide">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onNotification}
          className="relative p-1 rounded-full hover:bg-orange-600 transition"
        >
          <BellIcon className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </button>
        <button
          onClick={onCart}
          className="relative p-1 rounded-full hover:bg-orange-600 transition"
        >
          <ShoppingCartIcon className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            2
          </span>
        </button>
        <UserAvatar />
      </div>
    </div>

    {/* Search bar */}
    <div className="px-4 pb-3">
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Cari produk, brand, dan kategori..."
          className="w-full bg-white text-gray-800 px-10 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          onChange={(e) => onSearch && onSearch(e.target.value)}
        />
      </div>
    </div>
  </header>
);

export default Header;
