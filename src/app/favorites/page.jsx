"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaMapMarkerAlt, FaCoins, FaHeart } from "react-icons/fa";
import { fetchMultipleCities } from "../redux/weatherActions";
import { fetchCoins } from "../redux/cryptoActions";
import { loadPreferencesFromLocalStorage } from "../redux/userPreferencesActions";
import WeatherCard from "../components/WeatherCard";
import CryptoCard from "../components/CryptoCard";
import PageHeader from "../components/PageHeader";

const FavoritesPage = () => {
  const dispatch = useDispatch();
  const { multiCityData, loading: weatherLoading } = useSelector(
    (state) => state.weather
  );
  const { coins, loading: cryptoLoading } = useSelector(
    (state) => state.crypto
  );
  const { favoriteCities, favoriteCryptos } = useSelector(
    (state) => state.userPreferences
  );

  useEffect(() => {
    dispatch(loadPreferencesFromLocalStorage());

    // Fetch all cities and filter in the UI
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

    // If there are favorite cryptos, fetch them specifically
    if (favoriteCryptos.length > 0) {
      dispatch(fetchCoins(favoriteCryptos.join(",")));
    } else {
      // Otherwise fetch default cryptos
      dispatch(fetchCoins("bitcoin,ethereum,ripple,solana,cardano"));
    }
  }, [dispatch, favoriteCryptos.length]);

  // Filter weather data to only show favorite cities
  const favoriteCitiesData = multiCityData.filter((city) =>
    favoriteCities.includes(city.name)
  );

  // Filter crypto data to only show favorite cryptos
  const favoriteCryptosData = coins.filter((coin) =>
    favoriteCryptos.includes(coin.id)
  );

  const hasFavorites = favoriteCities.length > 0 || favoriteCryptos.length > 0;

  return (
    <div>
      <PageHeader
        title="My Favorites"
        description="View and manage your favorite cities and cryptocurrencies."
      />

      {!hasFavorites ? (
        <div className="bg-secondary-dark rounded-xl p-8 text-center">
          <FaHeart className="text-4xl text-red-400/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No favorites yet
          </h3>
          <p className="text-white/70 mb-6">
            You haven&apos;t added any cities or cryptocurrencies to your
            favorites yet.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/weather"
              className="inline-flex items-center gap-2 px-5 py-3 bg-primary-light hover:bg-primary rounded-lg text-white transition-colors">
              <FaMapMarkerAlt />
              <span>Browse Cities</span>
            </a>
            <a
              href="/crypto"
              className="inline-flex items-center gap-2 px-5 py-3 bg-primary-light hover:bg-primary rounded-lg text-white transition-colors">
              <FaCoins />
              <span>Browse Cryptocurrencies</span>
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {favoriteCities.length > 0 && (
            <section>
              <div className="flex items-center mb-6">
                <FaMapMarkerAlt className="text-primary-light mr-2" />
                <h2 className="text-2xl font-bold text-white">
                  Favorite Cities
                </h2>
              </div>

              {weatherLoading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-light"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoriteCitiesData.map((cityData, index) => (
                    <WeatherCard
                      key={index}
                      data={cityData}
                      isFavorite={true}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {favoriteCryptos.length > 0 && (
            <section>
              <div className="flex items-center mb-6">
                <FaCoins className="text-primary-light mr-2" />
                <h2 className="text-2xl font-bold text-white">
                  Favorite Cryptocurrencies
                </h2>
              </div>

              {cryptoLoading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-light"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {favoriteCryptosData.map((coinData, index) => (
                    <CryptoCard key={index} data={coinData} isFavorite={true} />
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
