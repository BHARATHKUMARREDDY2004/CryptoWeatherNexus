"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FaChartLine,
  FaCloudRain,
  FaTrash,
  FaExclamationCircle,
} from "react-icons/fa";
import { clearAllAlerts } from "../redux/cryptoActions";
import PageHeader from "../components/PageHeader";

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const { alerts } = useSelector((state) => state.crypto);
  const { weatherAlerts } = useSelector((state) => state.weather);

  // Combine both crypto and weather alerts and sort by timestamp
  const allAlerts = [...alerts, ...weatherAlerts].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <PageHeader
          title="Notifications"
          description="View your recent alerts and notifications."
        />

        {allAlerts.length > 0 && (
          <button
            onClick={() => dispatch(clearAllAlerts())}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition-colors">
            <FaTrash />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {allAlerts.length === 0 ? (
        <div className="bg-secondary-dark rounded-xl p-8 text-center">
          <FaExclamationCircle className="text-3xl text-white/30 mx-auto mb-3" />
          <h3 className="text-xl text-white font-semibold mb-2">
            No notifications yet
          </h3>
          <p className="text-white/70">
            Alerts about significant cryptocurrency price changes and weather
            events will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {allAlerts.map((alert, index) => (
            <div
              key={index}
              className={`bg-secondary-dark rounded-lg p-5 shadow-md ${
                alert.type === "priceAlert"
                  ? "border-l-4 border-primary-light"
                  : "border-l-4 border-blue-500"
              }`}>
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-full ${
                    alert.type === "priceAlert"
                      ? "bg-primary-darker text-primary-light"
                      : "bg-blue-900 text-blue-300"
                  }`}>
                  {alert.type === "priceAlert" ? (
                    <FaChartLine size={20} />
                  ) : (
                    <FaCloudRain size={20} />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-white">
                      {alert.type === "priceAlert"
                        ? `${alert.coin} Alert`
                        : `Weather Alert: ${alert.city || "Unknown location"}`}
                    </h3>
                    <span className="text-sm text-white/50">
                      {new Date(alert.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-white/80 mt-1">{alert.message}</p>

                  {alert.type === "priceAlert" && alert.change && (
                    <div
                      className={`mt-2 text-sm ${
                        alert.change > 0 ? "text-green-400" : "text-red-400"
                      }`}>
                      {alert.change > 0 ? "Increased by " : "Decreased by "}
                      {Math.abs(alert.change).toFixed(2)}%
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
