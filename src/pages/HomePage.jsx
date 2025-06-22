import { useState } from "react";
import ProductCard from "../components/ProductCard";
import UserAvatar from "../components/UserAvatar";
import {
  QrCodeIcon,
  CameraIcon,
  FireIcon,
  StarIcon,
  ShoppingBagIcon,
  DevicePhoneMobileIcon,
  SpeakerWaveIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

const categories = [
  { id: "all", name: "Semua", icon: ShoppingBagIcon },
  { id: "gadget", name: "Gadget", icon: DevicePhoneMobileIcon },
  { id: "audio", name: "Audio", icon: SpeakerWaveIcon },
  { id: "fashion", name: "Fashion", icon: HeartIcon },
  { id: "electronics", name: "Electronics", icon: DevicePhoneMobileIcon },
];

const HomePage = ({ products, onProductClick, user }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" ||
      product.category.toLowerCase() === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* User greeting */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-4">
        <div className="flex items-center gap-3 mb-3">
          <UserAvatar src={user.avatar} name={user.name} />
          <div>
            <div className="font-semibold text-lg">Hi, {user.name}</div>
            <div className="text-orange-100 text-sm">
              Selamat datang di MarketPlay!
            </div>
          </div>
        </div>

        {/* User stats */}
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="font-semibold">
              Rp{user.balance.toLocaleString()}
            </span>
            <span className="text-orange-100">Saldo</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold">{user.points}</span>
            <span className="text-orange-100">Poin</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold">{user.level}</span>
            <span className="text-orange-100">Level</span>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="px-4 py-3">
        <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg mb-1">Flash Sale!</h3>
              <p className="text-sm opacity-90">Diskon hingga 70%</p>
            </div>
            <FireIcon className="w-12 h-12 text-yellow-300" />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 py-3">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex flex-col items-center gap-1 px-4 py-3 rounded-lg whitespace-nowrap transition ${
                  selectedCategory === category.id
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-600 hover:bg-orange-50"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-3">
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-white rounded-lg p-3 flex items-center gap-3 hover:bg-gray-50 transition">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <QrCodeIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-left">
              <div className="font-medium text-sm">Scan NFC</div>
              <div className="text-xs text-gray-500">Cek produk</div>
            </div>
          </button>
          <button className="bg-white rounded-lg p-3 flex items-center gap-3 hover:bg-gray-50 transition">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CameraIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-left">
              <div className="font-medium text-sm">Scan Barcode</div>
              <div className="text-xs text-gray-500">Cari produk</div>
            </div>
          </button>
        </div>
      </div>

      {/* Products */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg text-gray-800">Produk Terpopuler</h2>
          <button className="text-orange-500 text-sm font-medium">
            Lihat Semua
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-20">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => onProductClick(product)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
