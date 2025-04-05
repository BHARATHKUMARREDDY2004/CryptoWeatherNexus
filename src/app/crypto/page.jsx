"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCoins,
  fetchTrendingCoins,
  simulatePriceAlert,
  setPriceAlert,
  clearAllAlerts,
  checkPriceAlerts,
} from "../redux/cryptoActions";
import {
  addFavoriteCrypto,
  removeFavoriteCrypto,
  loadPreferencesFromLocalStorage,
} from "../redux/userPreferencesActions";
import Link from "next/link";
import {
  FaHeart,
  FaRegHeart,
  FaInfoCircle,
  FaBell,
  FaTimes,
  FaFilter,
  FaStar,
  FaChartLine,
} from "react-icons/fa";

const CryptoPage = () => {
  const dispatch = useDispatch();
  const {
    coins,
    trendingCoins,
    liveData,
    loading,
    error,
    alerts,
    priceAlertSettings,
  } = useSelector((state) => state.crypto);
  const { favoriteCryptos } = useSelector((state) => state.userPreferences);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showPriceAlertModal, setShowPriceAlertModal] = useState(false);
  const [selectedCoinForAlert, setSelectedCoinForAlert] = useState(null);
  const [alertPrice, setAlertPrice] = useState("");
  const [alertType, setAlertType] = useState("above");
  const [viewMode, setViewMode] = useState("all"); // 'all', 'favorites', 'trending'
  const [fetchTimer, setFetchTimer] = useState(null);
  const [lastViewMode, setLastViewMode] = useState("all");

  useEffect(() => {
    dispatch(loadPreferencesFromLocalStorage());
    dispatch(fetchTrendingCoins());

    // Initial data fetch
    dispatch(fetchCoins("bitcoin,ethereum,ripple,solana,cardano"));

    // Set up periodic data refresh (every 60 seconds)
    const intervalId = setInterval(() => {
      if (viewMode === "favorites" && favoriteCryptos.length > 0) {
        dispatch(fetchCoins(favoriteCryptos.join(",")));
      } else if (viewMode === "all") {
        dispatch(fetchCoins("bitcoin,ethereum,ripple,solana,cardano"));
      }
    }, 60000);

    return () => {
      clearInterval(intervalId);
      if (fetchTimer) clearTimeout(fetchTimer);
    };
  }, [dispatch, viewMode, favoriteCryptos, fetchTimer]);

  // Handle view mode changes with debouncing
  useEffect(() => {
    // Only fetch if the view mode actually changed
    if (viewMode !== lastViewMode) {
      setLastViewMode(viewMode);

      // Clear any pending fetch
      if (fetchTimer) clearTimeout(fetchTimer);

      // Set a small delay before fetching to prevent rapid consecutive calls
      if (viewMode === "favorites" && favoriteCryptos.length > 0) {
        setFetchTimer(
          setTimeout(() => {
            dispatch(fetchCoins(favoriteCryptos.join(",")));
          }, 300)
        );
      } else if (viewMode === "all") {
        setFetchTimer(
          setTimeout(() => {
            dispatch(fetchCoins("bitcoin,ethereum,ripple,solana,cardano"));
          }, 300)
        );
      }
    }
  }, [viewMode, dispatch, lastViewMode, favoriteCryptos, fetchTimer]);

  // Handle changes to favorites list
  useEffect(() => {
    // Only refetch when in favorites view and favorites change
    if (viewMode === "favorites" && favoriteCryptos.length > 0) {
      // Clear any pending fetch
      if (fetchTimer) clearTimeout(fetchTimer);

      // Debounce the fetch
      setFetchTimer(
        setTimeout(() => {
          dispatch(fetchCoins(favoriteCryptos.join(",")));
        }, 300)
      );
    }

    // Check for price alerts periodically
    const alertCheckId = setInterval(() => {
      dispatch(checkPriceAlerts());
    }, 5000);

    // Simulate alerts for demo
    const alertIntervalId = setInterval(() => {
      if (coins.length > 0) {
        const randomCoin = coins[Math.floor(Math.random() * coins.length)];
        const randomChange = Math.random() * 8 - 4;
        dispatch(
          simulatePriceAlert(
            randomCoin.name,
            randomCoin.current_price,
            randomChange
          )
        );
      }
    }, 30000);

    return () => {
      clearInterval(alertCheckId);
      clearInterval(alertIntervalId);
    };
  }, [favoriteCryptos, viewMode, dispatch, fetchTimer, coins]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatMarketCap = (marketCap) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    } else {
      return `$${marketCap.toFixed(2)}`;
    }
  };

  const handleFavoriteToggle = (coinId) => {
    if (favoriteCryptos.includes(coinId)) {
      dispatch(removeFavoriteCrypto(coinId));
    } else {
      dispatch(addFavoriteCrypto(coinId));
    }
  };

  const openPriceAlertModal = (coin) => {
    setSelectedCoinForAlert(coin);
    setAlertPrice("");
    setAlertType("above");
    setShowPriceAlertModal(true);
  };

  const handleSetPriceAlert = () => {
    if (!selectedCoinForAlert || !alertPrice || isNaN(alertPrice)) return;

    dispatch(
      setPriceAlert(selectedCoinForAlert.id, alertType, parseFloat(alertPrice))
    );

    setShowPriceAlertModal(false);
  };

  const handleViewModeChange = (mode) => {
    // Don't refetch if switching to the same mode
    if (mode === viewMode) return;
    setViewMode(mode);
  };

  const renderTrendingCoins = () => {
    if (!trendingCoins || trendingCoins.length === 0) {
      return (
        <div className="text-center py-4">
          <p className="text-white">Loading trending coins...</p>
        </div>
      );
    }

    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
          <FaChartLine className="mr-2" /> Top 5 Trending Coins
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {trendingCoins.slice(0, 5).map((item, index) => {
            const coin = item.item;
            return (
              <div
                key={index}
                className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-colors">
                <div className="flex flex-col items-center">
                  <img
                    src={coin.small}
                    alt={coin.name}
                    className="w-12 h-12 mb-2"
                  />
                  <h3 className="text-lg font-semibold text-white text-center">
                    {coin.name}
                  </h3>
                  <p className="text-gray-300 uppercase text-sm">
                    {coin.symbol}
                  </p>
                  <p className="text-white text-sm mt-2">
                    Rank #{coin.market_cap_rank}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleFavoriteToggle(coin.id)}
                      className="p-2 rounded-full hover:bg-white/10 transition-colors">
                      {favoriteCryptos.includes(coin.id) ? (
                        <FaHeart className="text-red-500" />
                      ) : (
                        <FaRegHeart className="text-white" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderAlertsPanel = () => {
    if (!showAlerts) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-secondary-dark rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">
              Cryptocurrency Alerts
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => dispatch(clearAllAlerts())}
                className="text-white hover:text-red-400 p-2"
                aria-label="Clear all alerts">
                Clear All
              </button>
              <button
                onClick={() => setShowAlerts(false)}
                className="text-white hover:text-gray-300 p-2"
                aria-label="Close alerts panel">
                <FaTimes />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {alerts.length > 0 ? (
              <div className="space-y-3">
                {alerts.map((alert, index) => (
                  <div key={index} className="bg-white/5 p-3 rounded-md">
                    <div className="flex justify-between text-white">
                      <span>{alert.coin}</span>
                      <span>
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-white/80">{alert.message}</p>
                    {alert.type === "priceAlert" && (
                      <div className="mt-1 text-sm">
                        <span
                          className={
                            alert.alertType === "above"
                              ? "text-green-400"
                              : "text-red-400"
                          }>
                          {alert.alertType === "above"
                            ? "Exceeded"
                            : "Fell below"}{" "}
                          threshold: {formatPrice(alert.threshold)}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-white">No alerts yet</p>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/10">
            <h3 className="font-bold text-white mb-2">Active Price Alerts</h3>
            {Object.entries(priceAlertSettings).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(priceAlertSettings).map(
                  ([coinId, settings]) => {
                    const coin = coins.find((c) => c.id === coinId);
                    if (!coin) return null;

                    return (
                      <div key={coinId} className="bg-white/5 p-2 rounded-md">
                        <div className="font-semibold text-white">
                          {coin.name}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {settings.above && (
                            <div className="bg-green-500/20 text-green-400 text-sm px-2 py-1 rounded flex items-center">
                              Above {formatPrice(settings.above)}
                              <button
                                onClick={() =>
                                  dispatch(removePriceAlert(coinId, "above"))
                                }
                                className="ml-2 text-white/70 hover:text-white">
                                <FaTimes size={12} />
                              </button>
                            </div>
                          )}
                          {settings.below && (
                            <div className="bg-red-500/20 text-red-400 text-sm px-2 py-1 rounded flex items-center">
                              Below {formatPrice(settings.below)}
                              <button
                                onClick={() =>
                                  dispatch(removePriceAlert(coinId, "below"))
                                }
                                className="ml-2 text-white/70 hover:text-white">
                                <FaTimes size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            ) : (
              <p className="text-white/70">No active price alerts</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderPriceAlertModal = () => {
    if (!showPriceAlertModal || !selectedCoinForAlert) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-secondary-dark rounded-lg w-full max-w-md p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Set Price Alert for {selectedCoinForAlert.name}
          </h2>

          <div className="mb-4">
            <label className="block text-white mb-2">Alert Type</label>
            <div className="flex gap-4">
              <label className="flex items-center text-white">
                <input
                  type="radio"
                  name="alertType"
                  value="above"
                  checked={alertType === "above"}
                  onChange={() => setAlertType("above")}
                  className="mr-2"
                />
                Price goes above
              </label>
              <label className="flex items-center text-white">
                <input
                  type="radio"
                  name="alertType"
                  value="below"
                  checked={alertType === "below"}
                  onChange={() => setAlertType("below")}
                  className="mr-2"
                />
                Price goes below
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-white mb-2">Price (USD)</label>
            <input
              type="number"
              value={alertPrice}
              onChange={(e) => setAlertPrice(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white"
              placeholder="Enter price"
              min="0"
              step="0.01"
            />
            <p className="text-gray-400 text-sm mt-1">
              Current price: {formatPrice(selectedCoinForAlert.current_price)}
            </p>
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={() => setShowPriceAlertModal(false)}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSetPriceAlert}
              className="px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-primary transition-colors"
              disabled={!alertPrice || isNaN(alertPrice)}>
              Set Alert
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-light to-secondary-dark p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-wrap justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-0">
            Cryptocurrency Prices
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowAlerts(!showAlerts)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-dark rounded-lg hover:bg-primary transition-colors text-white relative">
              <FaBell />
              <span>Alerts</span>
              {alerts.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {alerts.length}
                </span>
              )}
            </button>
          </div>
        </header>

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => handleViewModeChange("all")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === "all"
                ? "bg-primary-light text-white"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}>
            <FaFilter className="inline mr-2" />
            All Coins
          </button>
          <button
            onClick={() => handleViewModeChange("favorites")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === "favorites"
                ? "bg-primary-light text-white"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}>
            <FaStar className="inline mr-2" />
            My Favorites
            {favoriteCryptos.length > 0 && (
              <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                {favoriteCryptos.length}
              </span>
            )}
          </button>
          <button
            onClick={() => handleViewModeChange("trending")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === "trending"
                ? "bg-primary-light text-white"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}>
            <FaChartLine className="inline mr-2" />
            Trending
          </button>
        </div>

        {viewMode === "trending" && renderTrendingCoins()}

        {(viewMode === "all" || viewMode === "favorites") && (
          <>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-light"></div>
              </div>
            ) : error ? (
              <div className="bg-red-500/20 text-white p-4 rounded-lg mb-4">
                <p className="text-lg">{error}</p>
                <p className="text-sm mt-2">
                  {error.includes("fetch")
                    ? "Rate limit reached. Please wait a moment before switching views."
                    : "An error occurred while loading cryptocurrency data."}
                </p>
              </div>
            ) : (
              <>
                {viewMode === "favorites" && favoriteCryptos.length === 0 ? (
                  <div className="bg-white/10 rounded-lg p-8 text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">
                      No Favorite Cryptocurrencies
                    </h2>
                    <p className="text-white/70 mb-6">
                      Add cryptocurrencies to your favorites by clicking the
                      heart icon.
                    </p>
                    <button
                      onClick={() => setViewMode("all")}
                      className="px-6 py-3 bg-primary-light text-white rounded-lg hover:bg-primary transition-colors">
                      Browse All Cryptocurrencies
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {coins.map((coin) => {
                      // Skip if we're in favorites mode and this coin isn't a favorite
                      if (
                        viewMode === "favorites" &&
                        !favoriteCryptos.includes(coin.id)
                      ) {
                        return null;
                      }

                      // Get real-time price if available, otherwise use the fetched price
                      const realTimePrice = liveData[coin.id]
                        ? parseFloat(liveData[coin.id])
                        : coin.current_price;

                      // Calculate if the price has changed since the last update
                      const priceChanged =
                        liveData[coin.id] &&
                        realTimePrice !== coin.current_price;
                      const priceIncreased =
                        priceChanged && realTimePrice > coin.current_price;

                      return (
                        <div
                          key={coin.id}
                          className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-colors">
                          <div className="flex flex-wrap items-center justify-between">
                            <div className="flex items-center gap-3 mb-2 md:mb-0">
                              <img
                                src={coin.image}
                                alt={coin.name}
                                className="w-10 h-10"
                              />
                              <div>
                                <Link href={`/crypto/${coin.id}`}>
                                  <h2 className="text-xl font-bold text-white hover:text-primary-light transition-colors cursor-pointer">
                                    {coin.name}
                                  </h2>
                                </Link>
                                <p className="text-gray-300 uppercase">
                                  {coin.symbol}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div
                                  className={`text-xl font-bold ${
                                    priceChanged
                                      ? priceIncreased
                                        ? "text-green-400"
                                        : "text-red-400"
                                      : "text-white"
                                  }`}>
                                  {formatPrice(realTimePrice)}
                                </div>
                                <div
                                  className={`${
                                    coin.price_change_percentage_24h >= 0
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }`}>
                                  {coin.price_change_percentage_24h >= 0
                                    ? "+"
                                    : ""}
                                  {coin.price_change_percentage_24h?.toFixed(2)}
                                  % (24h)
                                </div>
                              </div>

                              <div className="hidden md:block text-white text-right">
                                <div className="font-semibold">Market Cap</div>
                                <div>{formatMarketCap(coin.market_cap)}</div>
                              </div>

                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleFavoriteToggle(coin.id)}
                                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                                  aria-label={
                                    favoriteCryptos.includes(coin.id)
                                      ? "Remove from favorites"
                                      : "Add to favorites"
                                  }>
                                  {favoriteCryptos.includes(coin.id) ? (
                                    <FaHeart className="text-red-500" />
                                  ) : (
                                    <FaRegHeart className="text-white" />
                                  )}
                                </button>

                                <button
                                  onClick={() => openPriceAlertModal(coin)}
                                  className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
                                  aria-label="Set price alert">
                                  <FaBell />
                                </button>

                                <Link
                                  href={`/crypto/${coin.id}`}
                                  className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
                                  aria-label="View details">
                                  <FaInfoCircle />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {renderAlertsPanel()}
      {renderPriceAlertModal()}
    </div>
  );
};

export default CryptoPage;
