"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCoinDetails,
  fetchHistoricalData,
  fetchPricePrediction,
} from "../../redux/cryptoActions";
import {
  addFavoriteCrypto,
  removeFavoriteCrypto,
} from "../../redux/userPreferencesActions";
import Link from "next/link";
import {
  FaHeart,
  FaRegHeart,
  FaArrowLeft,
  FaChartLine,
  FaExchangeAlt,
  FaInfoCircle,
  FaChartPie,
  FaCalendarAlt,
} from "react-icons/fa";
import CryptoChart from "../../components/CryptoChart";
import { format } from "date-fns";

const CryptoDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = params;
  const { coinDetails, historicalData, predictionData, liveData } = useSelector(
    (state) => state.crypto
  );
  const { favoriteCryptos } = useSelector((state) => state.userPreferences);
  const [timeRange, setTimeRange] = useState(7); // Default to 7 days
  const [activeTab, setActiveTab] = useState("overview"); // 'overview', 'prediction', 'history'

  useEffect(() => {
    if (id) {
      dispatch(fetchCoinDetails(id));
      dispatch(fetchHistoricalData(id, timeRange));
      dispatch(fetchPricePrediction(id));
    }
  }, [dispatch, id, timeRange]);

  if (!coinDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-light to-secondary-dark p-4 md:p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-light"></div>
      </div>
    );
  }

  // Get real-time price if available
  const currentPrice = liveData[id]
    ? parseFloat(liveData[id])
    : coinDetails.market_data?.current_price?.usd || 0;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(price);
  };

  const formatLargeNumber = (num) => {
    if (num >= 1e12) {
      return `${(num / 1e12).toFixed(2)}T`;
    } else if (num >= 1e9) {
      return `${(num / 1e9).toFixed(2)}B`;
    } else if (num >= 1e6) {
      return `${(num / 1e6).toFixed(2)}M`;
    } else {
      return num.toLocaleString();
    }
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  const handleFavoriteToggle = () => {
    if (favoriteCryptos.includes(id)) {
      dispatch(removeFavoriteCrypto(id));
    } else {
      dispatch(addFavoriteCrypto(id));
    }
  };

  const renderPriceHistory = () => {
    if (!historicalData || !historicalData.prices) {
      return (
        <div className="p-8 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-light"></div>
        </div>
      );
    }

    return (
      <div className="p-4">
        <CryptoChart
          data={historicalData}
          timeRange={timeRange}
          coinName={coinDetails.name}
        />

        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <button
            onClick={() => setTimeRange(1)}
            className={`px-3 py-1 rounded-md ${
              timeRange === 1
                ? "bg-primary-light text-white"
                : "bg-white/5 text-gray-300 hover:bg-white/10"
            }`}>
            24h
          </button>
          <button
            onClick={() => setTimeRange(7)}
            className={`px-3 py-1 rounded-md ${
              timeRange === 7
                ? "bg-primary-light text-white"
                : "bg-white/5 text-gray-300 hover:bg-white/10"
            }`}>
            7d
          </button>
          <button
            onClick={() => setTimeRange(30)}
            className={`px-3 py-1 rounded-md ${
              timeRange === 30
                ? "bg-primary-light text-white"
                : "bg-white/5 text-gray-300 hover:bg-white/10"
            }`}>
            30d
          </button>
          <button
            onClick={() => setTimeRange(90)}
            className={`px-3 py-1 rounded-md ${
              timeRange === 90
                ? "bg-primary-light text-white"
                : "bg-white/5 text-gray-300 hover:bg-white/10"
            }`}>
            90d
          </button>
          <button
            onClick={() => setTimeRange(365)}
            className={`px-3 py-1 rounded-md ${
              timeRange === 365
                ? "bg-primary-light text-white"
                : "bg-white/5 text-gray-300 hover:bg-white/10"
            }`}>
            1y
          </button>
          <button
            onClick={() => setTimeRange(730)}
            className={`px-3 py-1 rounded-md ${
              timeRange === 730
                ? "bg-primary-light text-white"
                : "bg-white/5 text-gray-300 hover:bg-white/10"
            }`}>
            2y
          </button>
          <button
            onClick={() => setTimeRange(1825)}
            className={`px-3 py-1 rounded-md ${
              timeRange === 1825
                ? "bg-primary-light text-white"
                : "bg-white/5 text-gray-300 hover:bg-white/10"
            }`}>
            5y
          </button>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold text-white mb-4">
            Historical Performance
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full bg-white/5 rounded-lg">
              <thead>
                <tr className="text-left border-b border-white/10">
                  <th className="p-3">Period</th>
                  <th className="p-3">Open</th>
                  <th className="p-3">Close</th>
                  <th className="p-3">High</th>
                  <th className="p-3">Low</th>
                  <th className="p-3">Change</th>
                </tr>
              </thead>
              <tbody>
                {[7, 30, 90].map((days) => {
                  if (
                    !historicalData.prices ||
                    historicalData.prices.length < days
                  )
                    return null;

                  const currentPrice =
                    historicalData.prices[historicalData.prices.length - 1][1];
                  const pastPrice =
                    historicalData.prices[
                      Math.max(0, historicalData.prices.length - days)
                    ][1];
                  const pricesInPeriod = historicalData.prices
                    .slice(-days)
                    .map((p) => p[1]);
                  const highPrice = Math.max(...pricesInPeriod);
                  const lowPrice = Math.min(...pricesInPeriod);
                  const changePercent =
                    ((currentPrice - pastPrice) / pastPrice) * 100;

                  return (
                    <tr
                      key={days}
                      className="border-b border-white/10 text-white">
                      <td className="p-3 font-medium">{days} Days</td>
                      <td className="p-3">{formatPrice(pastPrice)}</td>
                      <td className="p-3">{formatPrice(currentPrice)}</td>
                      <td className="p-3">{formatPrice(highPrice)}</td>
                      <td className="p-3">{formatPrice(lowPrice)}</td>
                      <td
                        className={`p-3 ${
                          changePercent >= 0 ? "text-green-400" : "text-red-400"
                        }`}>
                        {formatPercentage(changePercent)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderPricePrediction = () => {
    if (!predictionData) {
      return (
        <div className="p-8 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-light"></div>
        </div>
      );
    }

    return (
      <div className="p-4">
        <div className="bg-white/5 p-4 rounded-lg mb-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white">
              Price Prediction (Next 7 Days)
            </h3>
            <p className="text-white/70 text-sm">
              Based on historical performance and market trends
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-around mb-6">
            <div className="bg-white/5 p-4 rounded-lg text-center">
              <div className="text-gray-300 mb-1">Current Trend</div>
              <div
                className={`text-xl font-bold ${
                  predictionData.trend === "bullish"
                    ? "text-green-400"
                    : "text-red-400"
                }`}>
                {predictionData.trend.toUpperCase()}
              </div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg text-center">
              <div className="text-gray-300 mb-1">Momentum</div>
              <div className="text-xl font-bold text-white">
                {predictionData.momentum}%
              </div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg text-center">
              <div className="text-gray-300 mb-1">7-Day SMA</div>
              <div className="text-xl font-bold text-white">
                {formatPrice(predictionData.movingAverages.sma7)}
              </div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg text-center">
              <div className="text-gray-300 mb-1">14-Day SMA</div>
              <div className="text-xl font-bold text-white">
                {formatPrice(predictionData.movingAverages.sma14)}
              </div>
            </div>
          </div>

          <div>
            <p className="text-white mb-6">
              <strong>Analysis:</strong> {coinDetails.name} is currently showing
              a {predictionData.trend} trend with
              {predictionData.trend === "bullish"
                ? " positive"
                : " negative"}{" "}
              momentum of {predictionData.momentum}%.
              {predictionData.trend === "bullish"
                ? ` The 7-day moving average is above the 14-day moving average, indicating potential continued growth.`
                : ` The 7-day moving average is below the 14-day moving average, indicating potential continued decline.`}
            </p>
          </div>

          <canvas
            id="prediction-chart"
            className="w-full h-auto"
            height="400"></canvas>

          <div className="mt-8">
            <h4 className="text-lg font-semibold text-white mb-3">
              Predicted Prices
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {predictionData.predictions.map((prediction, index) => {
                const date = new Date(prediction[0]);
                const price = prediction[1];
                const changePercent =
                  ((price - predictionData.lastPrice) /
                    predictionData.lastPrice) *
                  100;

                return (
                  <div key={index} className="bg-white/5 p-3 rounded-lg">
                    <div className="text-sm text-gray-300">
                      {format(date, "MMM d")}
                    </div>
                    <div className="text-lg font-semibold text-white">
                      {formatPrice(price)}
                    </div>
                    <div
                      className={`text-sm ${
                        changePercent >= 0 ? "text-green-400" : "text-red-400"
                      }`}>
                      {formatPercentage(changePercent)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 text-white/70 text-sm text-center">
            <p>
              <strong>Disclaimer:</strong> These predictions are based on
              historical data and simple algorithms. They should not be
              considered as financial advice. Always do your own research before
              making investment decisions.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderOverview = () => {
    return (
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white/10 p-6 rounded-lg">
            <div className="text-gray-300 mb-1">Current Price</div>
            <div className="text-3xl font-bold text-white mb-2">
              {formatPrice(currentPrice)}
            </div>
            <div
              className={`text-lg ${
                coinDetails.market_data?.price_change_percentage_24h >= 0
                  ? "text-green-400"
                  : "text-red-400"
              }`}>
              {coinDetails.market_data?.price_change_percentage_24h >= 0
                ? "+"
                : ""}
              {coinDetails.market_data?.price_change_percentage_24h?.toFixed(2)}
              % (24h)
            </div>
          </div>

          <div className="bg-white/10 p-6 rounded-lg">
            <div className="text-gray-300 mb-1">Market Cap</div>
            <div className="text-3xl font-bold text-white mb-2">
              $
              {formatLargeNumber(coinDetails.market_data?.market_cap?.usd || 0)}
            </div>
            <div
              className={`text-lg ${
                coinDetails.market_data?.market_cap_change_percentage_24h >= 0
                  ? "text-green-400"
                  : "text-red-400"
              }`}>
              {coinDetails.market_data?.market_cap_change_percentage_24h >= 0
                ? "+"
                : ""}
              {coinDetails.market_data?.market_cap_change_percentage_24h?.toFixed(
                2
              )}
              % (24h)
            </div>
          </div>

          <div className="bg-white/10 p-6 rounded-lg">
            <div className="text-gray-300 mb-1">Volume (24h)</div>
            <div className="text-3xl font-bold text-white mb-2">
              $
              {formatLargeNumber(
                coinDetails.market_data?.total_volume?.usd || 0
              )}
            </div>
            <div className="text-lg text-gray-300">
              {formatLargeNumber(
                coinDetails.market_data?.total_volume?.usd / currentPrice || 0
              )}{" "}
              {coinDetails.symbol?.toUpperCase()}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <CryptoChart
            data={historicalData}
            timeRange={timeRange}
            coinName={coinDetails.name}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/10 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-white mb-4">Market Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Market Cap Rank</span>
                <span className="text-white font-medium">
                  #{coinDetails.market_cap_rank}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">All-Time High</span>
                <span className="text-white font-medium">
                  {formatPrice(coinDetails.market_data?.ath?.usd || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">All-Time Low</span>
                <span className="text-white font-medium">
                  {formatPrice(coinDetails.market_data?.atl?.usd || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Circulating Supply</span>
                <span className="text-white font-medium">
                  {formatLargeNumber(
                    coinDetails.market_data?.circulating_supply || 0
                  )}{" "}
                  {coinDetails.symbol?.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Max Supply</span>
                <span className="text-white font-medium">
                  {coinDetails.market_data?.max_supply
                    ? `${formatLargeNumber(
                        coinDetails.market_data.max_supply
                      )} ${coinDetails.symbol?.toUpperCase()}`
                    : "Unlimited"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Fully Diluted Valuation</span>
                <span className="text-white font-medium">
                  {coinDetails.market_data?.fully_diluted_valuation?.usd
                    ? `$${formatLargeNumber(
                        coinDetails.market_data.fully_diluted_valuation.usd
                      )}`
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-white mb-4">
              About {coinDetails.name}
            </h2>
            <div className="text-gray-300 space-y-2 max-h-80 overflow-y-auto pr-2">
              {coinDetails.description?.en ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: coinDetails.description.en,
                  }}
                />
              ) : (
                <p>No description available.</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white/10 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Price Change</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["24h", "7d", "14d", "30d", "60d", "200d", "1y"].map((period) => {
              const changeKey = `price_change_percentage_${period}`;
              const change = coinDetails.market_data?.[changeKey];

              return (
                <div
                  key={period}
                  className="bg-white/5 p-4 rounded-lg text-center">
                  <div className="text-gray-300 mb-2">{period}</div>
                  {change !== undefined ? (
                    <div
                      className={`text-xl font-bold ${
                        change >= 0 ? "text-green-400" : "text-red-400"
                      }`}>
                      {change >= 0 ? "+" : ""}
                      {change.toFixed(2)}%
                    </div>
                  ) : (
                    <div className="text-gray-500">N/A</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white/10 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-white mb-4">
            Additional Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-white font-semibold mb-2">Links</h3>
              <ul className="space-y-2">
                {coinDetails.links?.homepage[0] && (
                  <li>
                    <a
                      href={coinDetails.links.homepage[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-light hover:underline">
                      Official Website
                    </a>
                  </li>
                )}
                {coinDetails.links?.blockchain_site.filter(Boolean)[0] && (
                  <li>
                    <a
                      href={
                        coinDetails.links.blockchain_site.filter(Boolean)[0]
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-light hover:underline">
                      Explorer
                    </a>
                  </li>
                )}
                {coinDetails.links?.official_forum_url.filter(Boolean)[0] && (
                  <li>
                    <a
                      href={
                        coinDetails.links.official_forum_url.filter(Boolean)[0]
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-light hover:underline">
                      Forum
                    </a>
                  </li>
                )}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {coinDetails.categories
                  ?.filter(Boolean)
                  .map((category, index) => (
                    <span
                      key={index}
                      className="bg-white/10 px-3 py-1 rounded-full text-sm text-white">
                      {category}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-light to-secondary-dark p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
              aria-label="Go back">
              <FaArrowLeft />
            </button>
            <div className="flex items-center gap-3">
              <img
                src={coinDetails.image?.small}
                alt={coinDetails.name}
                className="w-8 h-8"
              />
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {coinDetails.name}
              </h1>
              <span className="text-gray-300 uppercase">
                {coinDetails.symbol}
              </span>
              <button
                onClick={handleFavoriteToggle}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label={
                  favoriteCryptos.includes(id)
                    ? "Remove from favorites"
                    : "Add to favorites"
                }>
                {favoriteCryptos.includes(id) ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart className="text-white" />
                )}
              </button>
            </div>
          </div>
          <Link
            href="/crypto"
            className="px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-primary transition-colors">
            All Cryptocurrencies
          </Link>
        </header>

        <div className="bg-white/5 rounded-lg overflow-hidden mb-6">
          <div className="flex border-b border-white/10">
            <button
              className={`px-6 py-4 flex items-center gap-2 ${
                activeTab === "overview"
                  ? "text-white bg-white/10"
                  : "text-gray-300 hover:bg-white/5"
              }`}
              onClick={() => setActiveTab("overview")}>
              <FaInfoCircle />
              <span>Overview</span>
            </button>
            <button
              className={`px-6 py-4 flex items-center gap-2 ${
                activeTab === "prediction"
                  ? "text-white bg-white/10"
                  : "text-gray-300 hover:bg-white/5"
              }`}
              onClick={() => setActiveTab("prediction")}>
              <FaChartLine />
              <span>Price Prediction</span>
            </button>
            <button
              className={`px-6 py-4 flex items-center gap-2 ${
                activeTab === "history"
                  ? "text-white bg-white/10"
                  : "text-gray-300 hover:bg-white/5"
              }`}
              onClick={() => setActiveTab("history")}>
              <FaCalendarAlt />
              <span>Historical Data</span>
            </button>
          </div>

          <div>
            {activeTab === "overview" && renderOverview()}
            {activeTab === "prediction" && renderPricePrediction()}
            {activeTab === "history" && renderPriceHistory()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoDetailPage;
