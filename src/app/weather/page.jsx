"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaSearch, FaExclamationCircle } from "react-icons/fa";
import {
  fetchMultipleCities,
  fetchWeatherByCity,
} from "../redux/weatherActions";
import { loadPreferencesFromLocalStorage } from "../redux/userPreferencesActions";
import WeatherCard from "../components/WeatherCard";
import PageHeader from "../components/PageHeader";

const WeatherPage = () => {
  const dispatch = useDispatch();
  const [searchCity, setSearchCity] = useState("");
  const { weatherData, multiCityData, loading, error, searched } = useSelector(
    (state) => state.weather
  );
  const { favoriteCities } = useSelector((state) => state.userPreferences);

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
    }, 60000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      dispatch(fetchWeatherByCity(searchCity));
    }
  };

  return (
    <div>
      <PageHeader
        title="Weather"
        description="Check current weather conditions for cities around the world."
      />

      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search for a city..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="w-full bg-secondary-darker border border-gray-700 rounded-lg p-3 pl-4 pr-10 text-black focus:outline-none focus:border-primary-light"
            />
          </div>
          <button
            type="submit"
            className="bg-primary-light hover:bg-primary text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center">
            <FaSearch className="mr-2" />
            <span>Search</span>
          </button>
        </form>
      </div>

      {searched && weatherData && weatherData.weather && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Search Result</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <WeatherCard
              data={weatherData}
              isFavorite={favoriteCities.includes(weatherData.name)}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 text-red-200 p-4 rounded-lg mb-8 flex items-start gap-2">
          <FaExclamationCircle className="mt-1 flex-shrink-0" />
          <div>
            <p className="font-semibold">Error loading weather data</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {favoriteCities.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Favorite Cities</h2>
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-light"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {multiCityData
                .filter((city) => favoriteCities.includes(city.name))
                .map((cityData, index) => (
                  <WeatherCard key={index} data={cityData} isFavorite={true} />
                ))}
            </div>
          )}
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-white mb-4">All Cities</h2>
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-light"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {multiCityData.map((cityData, index) => (
              <WeatherCard
                key={index}
                data={cityData}
                isFavorite={favoriteCities.includes(cityData.name)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherPage;
