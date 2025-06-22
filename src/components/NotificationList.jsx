import { useState } from "react";
import {
  BellIcon,
  XMarkIcon,
  FireIcon,
  GiftIcon,
  ShoppingBagIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const NotificationList = ({ notifications, onClose, onMarkAsRead }) => {
  const [activeTab, setActiveTab] = useState("all");

  const getNotificationIcon = (type) => {
    switch (type) {
      case "flash_sale":
        return <FireIcon className="w-5 h-5 text-red-500" />;
      case "new_product":
        return <GiftIcon className="w-5 h-5 text-green-500" />;
      case "order":
        return <ShoppingBagIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <BellIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "flash_sale":
        return "bg-red-50 border-red-200";
      case "new_product":
        return "bg-green-50 border-green-200";
      case "order":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.read;
    return notification.type === activeTab;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-sm mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Notifikasi</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <XMarkIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-3 text-sm font-medium transition ${
              activeTab === "all"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setActiveTab("unread")}
            className={`flex-1 py-3 text-sm font-medium transition relative ${
              activeTab === "unread"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Belum Dibaca
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <BellIcon className="w-12 h-12 mb-4 text-gray-300" />
              <p className="text-sm">Tidak ada notifikasi</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border ${getNotificationColor(
                    notification.type
                  )} ${!notification.read ? "ring-2 ring-orange-200" : ""}`}
                  onClick={() => onMarkAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-medium text-gray-800">
                          {notification.title}
                        </h4>
                        <span className="text-xs text-gray-500 ml-2">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      {!notification.read && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          <span className="text-xs text-orange-600 font-medium">
                            Baru
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => {
              notifications.forEach((n) => onMarkAsRead(n.id));
            }}
            className="w-full text-sm text-orange-500 font-medium hover:text-orange-600 transition"
          >
            Tandai Semua Dibaca
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationList;
