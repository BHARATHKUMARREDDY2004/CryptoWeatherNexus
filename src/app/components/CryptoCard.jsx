import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { FaHeart, FaRegHeart, FaArrowRight } from "react-icons/fa";
import {
  addFavoriteCrypto,
  removeFavoriteCrypto,
} from "../redux/userPreferencesActions";

const CryptoCard = ({ data, isFavorite }) => {
  const dispatch = useDispatch();
  const { liveData } = useSelector((state) => state.crypto);

  if (!data) return null;

  // Real-time price if available, otherwise use the fetched price
  const realTimePrice = liveData[data.id]
    ? parseFloat(liveData[data.id])
    : data.current_price;

  // Calculates if the price has changed since the last update
  const priceChanged =
    liveData[data.id] && realTimePrice !== data.current_price;
  const priceIncreased = priceChanged && realTimePrice > data.current_price;

  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavoriteCrypto(data.id));
    } else {
      dispatch(addFavoriteCrypto(data.id));
    }
  };

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

  return (
    <div className="bg-secondary-darker rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="p-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={data.image} alt={data.name} className="w-10 h-10" />
            <div>
              <Link href={`/crypto/${data.id}`}>
                <h3 className="text-xl font-bold text-white hover:text-primary-light transition-colors">
                  {data.name}
                </h3>
              </Link>
              <p className="text-xs text-white/60 uppercase">{data.symbol}</p>
            </div>
          </div>

          <button
            onClick={toggleFavorite}
            className="p-1 hover:text-red-400 transition-colors">
            {isFavorite ? (
              <FaHeart className="text-red-400" />
            ) : (
              <FaRegHeart className="text-white" />
            )}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <p className="text-white/60 text-sm">Price</p>
            <p
              className={`text-lg font-bold ${
                priceChanged
                  ? priceIncreased
                    ? "text-green-400"
                    : "text-red-400"
                  : "text-white"
              }`}>
              {formatPrice(realTimePrice)}
            </p>
          </div>

          <div>
            <p className="text-white/60 text-sm">24h Change</p>
            <p
              className={`text-lg font-bold ${
                data.price_change_percentage_24h >= 0
                  ? "text-green-400"
                  : "text-red-400"
              }`}>
              {data.price_change_percentage_24h?.toFixed(2)}%
            </p>
          </div>

          <div>
            <p className="text-white/60 text-sm">Market Cap</p>
            <p className="text-lg font-bold text-white">
              {formatMarketCap(data.market_cap)}
            </p>
          </div>
        </div>
      </div>

      <Link
        href={`/crypto/${data.id}`}
        className="block bg-primary-darker text-white py-3 px-4 text-center text-sm group hover:bg-primary-dark transition-colors">
        <span className="flex items-center justify-center gap-2">
          <span>View Details</span>
          <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
        </span>
      </Link>
    </div>
  );
};

export default CryptoCard;
