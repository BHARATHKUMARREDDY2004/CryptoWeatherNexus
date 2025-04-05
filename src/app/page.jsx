"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import {
  FaArrowRight,
  FaHeart,
  FaExclamationCircle,
  FaCloudSun,
  FaBitcoin,
  FaNewspaper,
} from "react-icons/fa";
import { loadPreferencesFromLocalStorage } from "./redux/userPreferencesActions";
import { fetchMultipleCities } from "./redux/weatherActions";
import { fetchCoins } from "./redux/cryptoActions";
import { fetchCryptoNews } from "./redux/newsActions";
import WeatherCard from "./components/WeatherCard";
import CryptoCard from "./components/CryptoCard";
import NewsCard from "./components/NewsCard";
import PageHeader from "./components/PageHeader";

function getCurrentDate() {
  const currentDate = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return currentDate.toLocaleDateString("en-US", options);
}

const Dashboard = () => {
  const date = getCurrentDate();
  const dispatch = useDispatch();
  const {
    multiCityData,
    loading: weatherLoading,
    error: weatherError,
  } = useSelector((state) => state.weather);
  const {
    coins,
    loading: cryptoLoading,
    error: cryptoError,
  } = useSelector((state) => state.crypto);
  const {
    articles,
    loading: newsLoading,
    error: newsError,
  } = useSelector((state) => state.news);
  const { favoriteCities, favoriteCryptos } = useSelector(
    (state) => state.userPreferences
  );

  useEffect(() => {
    dispatch(loadPreferencesFromLocalStorage());

    // Fetch weather for predefined cities
    dispatch(
      fetchMultipleCities([
        "New Delhi",
        "Hyderabad",
        "Chennai",
        "New York",
        "London",
        "Tokyo",
      ])
    );

    // Fetch cryptocurrency data
    dispatch(fetchCoins("bitcoin,ethereum,ripple,solana,cardano"));

    // Fetch crypto news
    dispatch(fetchCryptoNews());

    // Set up refresh interval (60 seconds)
    const intervalId = setInterval(() => {
      dispatch(
        fetchMultipleCities([
          "New Delhi",
          "Hyderabad",
          "Chennai",
          "New York",
          "London",
          "Tokyo",
        ])
      );
      dispatch(fetchCoins("bitcoin,ethereum,ripple,solana,cardano"));
      dispatch(fetchCryptoNews());
    }, 60000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  return (
    <div className="space-y-10">
      <div className="bg-gradient-to-r from-secondary-dark to-primary-darker p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Welcome to CryptoWeather Nexus
        </h1>
        <p className="text-white/70">{date}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm flex items-center">
            <div className="bg-primary-light/20 p-4 rounded-full mr-4">
              <FaCloudSun className="text-2xl text-primary-light" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Weather Updates</h3>
              <p className="text-white/70 text-sm">
                {multiCityData.length} cities available
              </p>
            </div>
          </div>

          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm flex items-center">
            <div className="bg-primary-light/20 p-4 rounded-full mr-4">
              <FaBitcoin className="text-2xl text-primary-light" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Crypto Tracking</h3>
              <p className="text-white/70 text-sm">
                {coins.length} cryptocurrencies
              </p>
            </div>
          </div>

          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm flex items-center">
            <div className="bg-primary-light/20 p-4 rounded-full mr-4">
              <FaHeart className="text-2xl text-primary-light" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Your Favorites</h3>
              <p className="text-white/70 text-sm">
                {favoriteCities.length} cities, {favoriteCryptos.length} cryptos
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-secondary-dark rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <FaCloudSun className="text-primary-light mr-3 text-xl" />
            <h2 className="text-2xl font-bold text-white">Weather Updates</h2>
          </div>
          <Link
            href="/weather"
            className="bg-primary-darker hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
            <span>View All Cities</span>
            <FaArrowRight />
          </Link>
        </div>

        {weatherLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-light"></div>
          </div>
        ) : weatherError ? (
          <div className="bg-red-900/30 text-red-200 p-4 rounded-lg flex items-start gap-2">
            <FaExclamationCircle className="mt-1 flex-shrink-0" />
            <div>
              <p className="font-semibold">Error loading weather data</p>
              <p className="text-sm">{weatherError}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {multiCityData.slice(0, 6).map((cityData, index) => (
              <WeatherCard
                key={index}
                data={cityData}
                isFavorite={favoriteCities.includes(cityData.name)}
              />
            ))}
          </div>
        )}
      </section>

      <section className="bg-secondary-dark rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <FaBitcoin className="text-primary-light mr-3 text-xl" />
            <h2 className="text-2xl font-bold text-white">
              Cryptocurrency Markets
            </h2>
          </div>
          <Link
            href="/crypto"
            className="bg-primary-darker hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
            <span>View All Cryptocurrencies</span>
            <FaArrowRight />
          </Link>
        </div>

        {cryptoLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-light"></div>
          </div>
        ) : cryptoError ? (
          <div className="bg-red-900/30 text-red-200 p-4 rounded-lg flex items-start gap-2">
            <FaExclamationCircle className="mt-1 flex-shrink-0" />
            <div>
              <p className="font-semibold">Error loading cryptocurrency data</p>
              <p className="text-sm">{cryptoError}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {coins.slice(0, 5).map((coin, index) => (
              <CryptoCard
                key={index}
                data={coin}
                isFavorite={favoriteCryptos.includes(coin.id)}
              />
            ))}
          </div>
        )}
      </section>

      <section className="bg-secondary-dark rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <FaNewspaper className="text-primary-light mr-3 text-xl" />
            <h2 className="text-2xl font-bold text-white">Crypto News</h2>
          </div>
          <Link
            href="/news"
            className="bg-primary-darker hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
            <span>View All News</span>
            <FaArrowRight />
          </Link>
        </div>

        {newsLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-light"></div>
          </div>
        ) : newsError ? (
          <div className="bg-red-900/30 text-red-200 p-4 rounded-lg flex items-start gap-2">
            <FaExclamationCircle className="mt-1 flex-shrink-0" />
            <div>
              <p className="font-semibold">Error loading news</p>
              <p className="text-sm">{newsError}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {articles.slice(0, 5).map((article, index) => (
              <NewsCard key={index} data={article} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
