import React, { useState } from "react";
import {
  FaTimes,
  FaHeart,
  FaBell,
  FaInfoCircle,
  FaChartLine,
  FaStar,
  FaRegHeart,
} from "react-icons/fa";

const UserGuide = () => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        className="fixed bottom-4 right-4 bg-primary-light text-white px-4 py-2 rounded-full shadow-lg hover:bg-primary transition-colors z-40"
        onClick={() => setIsOpen(true)}>
        Guide
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-secondary-dark rounded-lg w-full max-w-3xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-4 border-b border-white/10 sticky top-0 bg-secondary-dark">
          <h2 className="text-xl font-bold text-white">
            Cryptocurrency Features Guide
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-gray-300 p-2">
            <FaTimes />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <section>
            <h3 className="text-lg font-bold text-white mb-3 flex items-center">
              <FaChartLine className="mr-2" /> Trending Cryptocurrencies
            </h3>
            <p className="text-white/80 mb-2">
              The app displays the top 5 trending cryptocurrencies based on
              search popularity and trading activity.
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-1 ml-4">
              <li>
                Click on the "Trending" tab to view the most popular
                cryptocurrencies
              </li>
              <li>Add trending coins to your favorites with the heart icon</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-white mb-3 flex items-center">
              <FaStar className="mr-2" /> Managing Favorites
            </h3>
            <p className="text-white/80 mb-2">
              You can create a personalized list of cryptocurrencies to keep
              track of your favorites.
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-1 ml-4">
              <li>
                Click the <FaHeart className="inline text-red-500" /> icon to
                add a coin to your favorites
              </li>
              <li>
                Click the <FaRegHeart className="inline text-white" /> icon to
                remove a coin from your favorites
              </li>
              <li>
                Use the &ldquo;My Favorites&rdquo; tab to see only your favorite
                cryptocurrencies
              </li>
              <li>Your favorites are saved and will persist between visits</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-white mb-3 flex items-center">
              <FaBell className="mr-2" /> Price Alerts
            </h3>
            <p className="text-white/80 mb-2">
              Set custom price alerts to be notified when cryptocurrencies reach
              specific prices.
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-1 ml-4">
              <li>
                Click the <FaBell className="inline text-white" /> icon next to
                any cryptocurrency
              </li>
              <li>
                Set alerts for when prices go above or below specific thresholds
              </li>
              <li>View all your active price alerts in the Alerts panel</li>
              <li>Receive notifications when your alert conditions are met</li>
              <li>
                The system also generates alerts for significant price movements
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-white mb-3 flex items-center">
              <FaInfoCircle className="mr-2" /> Detailed Information
            </h3>
            <p className="text-white/80 mb-2">
              Access comprehensive details about any cryptocurrency.
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-1 ml-4">
              <li>
                Click the <FaInfoCircle className="inline text-white" /> icon or
                the cryptocurrency name
              </li>
              <li>View historical price charts with multiple time ranges</li>
              <li>
                See key metrics like market cap, volume, and supply information
              </li>
              <li>Read about the cryptocurrency's purpose and technology</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-white mb-3">
              Real-Time Data
            </h3>
            <p className="text-white/80">
              The app uses WebSockets to provide real-time price updates for
              cryptocurrencies. When prices change, you&apos;ll see them
              highlighted in green (increase) or red (decrease).
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;
