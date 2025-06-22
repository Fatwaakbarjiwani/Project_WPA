import {
  ArrowLeftIcon,
  CogIcon,
  HeartIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  GiftIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import UserAvatar from "../components/UserAvatar";
import NotificationManager from "../components/NotificationManager";

const ProfilePage = ({ user, onBack }) => {
  const menuItems = [
    {
      id: "orders",
      title: "Pesanan Saya",
      icon: ShoppingBagIcon,
      color: "blue",
      count: 3,
    },
    {
      id: "wishlist",
      title: "Wishlist",
      icon: HeartIcon,
      color: "red",
      count: 12,
    },
    {
      id: "wallet",
      title: "Dompet Digital",
      icon: CreditCardIcon,
      color: "green",
      count: null,
    },
    {
      id: "rewards",
      title: "Rewards & Poin",
      icon: GiftIcon,
      color: "purple",
      count: user.points,
    },
    {
      id: "settings",
      title: "Pengaturan",
      icon: CogIcon,
      color: "gray",
      count: null,
    },
    {
      id: "help",
      title: "Bantuan",
      icon: QuestionMarkCircleIcon,
      color: "orange",
      count: null,
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600",
      red: "bg-red-100 text-red-600",
      green: "bg-green-100 text-green-600",
      purple: "bg-purple-100 text-purple-600",
      gray: "bg-gray-100 text-gray-600",
      orange: "bg-orange-100 text-orange-600",
    };
    return colors[color] || colors.gray;
  };

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
        <h1 className="text-lg font-semibold">Profil</h1>
        <div className="w-10"></div>
      </div>

      {/* User Info */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-6">
        <div className="flex items-center gap-4 mb-4">
          <UserAvatar src={user.avatar} name={user.name} size="xl" />
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-1">{user.name}</h2>
            <p className="text-orange-100 text-sm mb-2">{user.email}</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="bg-orange-400 px-2 py-1 rounded-full text-xs font-medium">
                {user.level}
              </span>
              <span className="text-orange-100">
                Bergabung {new Date(user.joinDate).getFullYear()}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">
              Rp{user.balance.toLocaleString()}
            </div>
            <div className="text-orange-100 text-xs">Saldo</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{user.points}</div>
            <div className="text-orange-100 text-xs">Poin</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">3</div>
            <div className="text-orange-100 text-xs">Pesanan</div>
          </div>
        </div>
      </div>

      {/* Notification Manager */}
      <div className="px-4 py-4">
        <NotificationManager />
      </div>

      {/* Menu Items */}
      <div className="px-4 py-4">
        <div className="bg-white rounded-lg shadow-sm">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.id}>
                <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClasses(
                        item.color
                      )}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-gray-800">
                      {item.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.count !== null && (
                      <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full font-medium">
                        {item.count}
                      </span>
                    )}
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </button>
                {index < menuItems.length - 1 && (
                  <div className="border-b border-gray-100 mx-4"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Address */}
      <div className="px-4 py-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-medium text-gray-800 mb-2">Alamat Pengiriman</h3>
          <p className="text-sm text-gray-600">{user.address}</p>
          <button className="text-orange-500 text-sm font-medium mt-2">
            Ubah Alamat
          </button>
        </div>
      </div>

      {/* Logout */}
      <div className="px-4 py-4">
        <button className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition">
          Keluar
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
