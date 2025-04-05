import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  FaExclamationTriangle,
  FaChartLine,
  FaCloudRain,
  FaTimes,
} from "react-icons/fa";

const NotificationSystem = () => {
  const { alerts } = useSelector((state) => state.crypto);
  const [notifications, setNotifications] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // When new alerts come in, add them to notifications
    if (alerts.length > 0) {
      const latestAlert = alerts[0]; // Most recent alert

      // Only add if it's not already in our notifications
      if (!notifications.some((n) => n.timestamp === latestAlert.timestamp)) {
        setNotifications((prev) =>
          [
            {
              id: Date.now(),
              ...latestAlert,
            },
            ...prev,
          ].slice(0, 5)
        ); // Keep only the 5 most recent

        setIsVisible(true);

        // Auto-hide after 5 seconds
        setTimeout(() => {
          setIsVisible(false);
        }, 5000);
      }
    }
  }, [alerts, notifications]);

  const closeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (notifications.length <= 1) {
      setIsVisible(false);
    }
  };

  if (!isVisible || notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 w-full max-w-sm">
      <div className="space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-start p-4 rounded-lg shadow-lg animate-slide-in ${
              notification.type === "priceAlert"
                ? "bg-primary-darker"
                : notification.type === "weatherAlert"
                ? "bg-blue-900"
                : "bg-secondary-dark"
            }`}>
            <div className="flex-shrink-0 mr-3">
              {notification.type === "priceAlert" ? (
                <FaChartLine className="text-xl text-primary-light" />
              ) : notification.type === "weatherAlert" ? (
                <FaCloudRain className="text-xl text-blue-400" />
              ) : (
                <FaExclamationTriangle className="text-xl text-yellow-400" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-semibold text-white">
                  {notification.type === "priceAlert"
                    ? `${notification.coin} Alert`
                    : notification.type === "weatherAlert"
                    ? `Weather Alert: ${
                        notification.city || "Unknown location"
                      }`
                    : "General Alert"}
                </h4>
                <button
                  onClick={() => closeNotification(notification.id)}
                  className="text-white/70 hover:text-white">
                  <FaTimes />
                </button>
              </div>
              <p className="text-white/90 text-sm mt-1">
                {notification.message}
              </p>
              <p className="text-white/60 text-xs mt-2">
                {new Date(notification.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSystem;
