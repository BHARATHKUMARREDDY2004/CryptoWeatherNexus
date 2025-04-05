"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  FaArrowLeft,
  FaHeart,
  FaRegHeart,
  FaChartLine,
  FaCalendarAlt,
  FaTemperatureHigh,
  FaWind,
  FaCloudRain,
} from "react-icons/fa";
import {
  fetchWeatherByCity,
  fetchWeatherHistory,
} from "../../redux/weatherActions";
import {
  addFavoriteCity,
  removeFavoriteCity,
} from "../../redux/userPreferencesActions";

const CityWeatherPage = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("forecast");
  const { city } = params;
  const decodedCity = decodeURIComponent(city);

  const { weatherData, historyData, loading, error } = useSelector(
    (state) => state.weather
  );
  const { favoriteCities } = useSelector((state) => state.userPreferences);

  const isFavorite = favoriteCities.includes(decodedCity);

  useEffect(() => {
    dispatch(fetchWeatherByCity(decodedCity));
    // In a real app, you would fetch actual historical data
    // Here we're simulating it
    dispatch(fetchWeatherHistory(decodedCity));
  }, [dispatch, decodedCity]);

  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavoriteCity(decodedCity));
    } else {
      dispatch(addFavoriteCity(decodedCity));
    }
  };

  const kelvinToCelsius = (kelvin) => {
    return (kelvin - 273.15).toFixed(1);
  };

  // Generate mock historical data if not available
  const getHistoricalData = () => {
    if (historyData && historyData.length > 0) return historyData;

    const today = new Date();
    const mockData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);

      mockData.push({
        date: date.toLocaleDateString(),
        temp: Math.round(15 + Math.random() * 15),
        description: ["Clear", "Partly Cloudy", "Cloudy", "Light Rain", "Rain"][
          Math.floor(Math.random() * 5)
        ],
        humidity: Math.round(40 + Math.random() * 40),
        windSpeed: (2 + Math.random() * 8).toFixed(1),
      });
    }

    return mockData;
  };

  // Generate mock forecast data
  const getForecastData = () => {
    const mockForecast = [];
    const now = new Date();

    for (let i = 1; i <= 5; i++) {
      const date = new Date();
      date.setDate(now.getDate() + i);

      mockForecast.push({
        date: date.toLocaleDateString(),
        temp_min: Math.round(10 + Math.random() * 10),
        temp_max: Math.round(20 + Math.random() * 10),
        description: ["Clear", "Partly Cloudy", "Cloudy", "Light Rain", "Rain"][
          Math.floor(Math.random() * 5)
        ],
        humidity: Math.round(40 + Math.random() * 40),
        windSpeed: (2 + Math.random() * 8).toFixed(1),
      });
    }

    return mockForecast;
  };

  const getWeatherIcon = (condition) => {
    const icons = {
      Clear: "wi-day-sunny",
      "Partly Cloudy": "wi-day-cloudy",
      Cloudy: "wi-cloudy",
      "Light Rain": "wi-day-rain",
      Rain: "wi-rain",
      Thunderstorm: "wi-thunderstorm",
      Snow: "wi-snow",
      Mist: "wi-fog",
    };

    return icons[condition] || "wi-day-cloudy";
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-light"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-500/20 text-white p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">
            Error Loading Weather Data
          </h2>
          <p>{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 bg-white text-red-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const historicalData = getHistoricalData();
  const forecastData = getForecastData();

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="bg-secondary-darker p-2 rounded-full text-white hover:bg-secondary-dark transition-colors">
            <FaArrowLeft />
          </button>
          <h1 className="text-3xl font-bold text-white">{decodedCity}</h1>
          <button
            onClick={toggleFavorite}
            className="text-white hover:text-red-400 transition-colors">
            {isFavorite ? (
              <FaHeart className="text-red-400 text-xl" />
            ) : (
              <FaRegHeart className="text-xl" />
            )}
          </button>
        </div>
      </div>

      {weatherData && weatherData.weather && (
        <div className="bg-secondary-dark rounded-xl overflow-hidden shadow-lg mb-8">
          <div className="bg-secondary-darker p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <i
                    className={`wi wi-day-${weatherData.weather[0].main.toLowerCase()} text-8xl text-white`}></i>
                  <p className="text-xl text-white mt-2 capitalize">
                    {weatherData.weather[0].description}
                  </p>
                </div>
              </div>

              <div className="text-center flex flex-col justify-center">
                <div className="text-5xl font-bold text-white mb-2">
                  {kelvinToCelsius(weatherData.main.temp)}°C
                </div>
                <div className="text-white/70">
                  Feels like {kelvinToCelsius(weatherData.main.feels_like)}°C
                </div>
                <div className="mt-4 flex justify-center gap-4 text-white/80">
                  <div>
                    <span className="font-semibold">Min:</span>{" "}
                    {kelvinToCelsius(weatherData.main.temp_min)}°C
                  </div>
                  <div>
                    <span className="font-semibold">Max:</span>{" "}
                    {kelvinToCelsius(weatherData.main.temp_max)}°C
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <div className="space-y-3">
                  <div className="flex items-center text-white gap-3">
                    <FaTemperatureHigh className="text-primary-light" />
                    <div>
                      <div className="text-white/70">Humidity</div>
                      <div className="font-semibold">
                        {weatherData.main.humidity}%
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-white gap-3">
                    <FaWind className="text-primary-light" />
                    <div>
                      <div className="text-white/70">Wind Speed</div>
                      <div className="font-semibold">
                        {(weatherData.wind.speed * 3.6).toFixed(1)} km/h
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-white gap-3">
                    <FaCloudRain className="text-primary-light" />
                    <div>
                      <div className="text-white/70">Pressure</div>
                      <div className="font-semibold">
                        {weatherData.main.pressure} hPa
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700">
            <div className="flex">
              <button
                className={`flex-1 py-3 px-4 flex justify-center items-center gap-2 ${
                  activeTab === "forecast"
                    ? "bg-primary-dark text-white"
                    : "text-white/70 hover:bg-secondary-darker"
                }`}
                onClick={() => setActiveTab("forecast")}>
                <FaCalendarAlt />
                <span>5-Day Forecast</span>
              </button>
              <button
                className={`flex-1 py-3 px-4 flex justify-center items-center gap-2 ${
                  activeTab === "history"
                    ? "bg-primary-dark text-white"
                    : "text-white/70 hover:bg-secondary-darker"
                }`}
                onClick={() => setActiveTab("history")}>
                <FaChartLine />
                <span>Historical Data</span>
              </button>
            </div>

            <div className="p-6">
              {activeTab === "forecast" ? (
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    5-Day Weather Forecast
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {forecastData.map((day, index) => (
                      <div
                        key={index}
                        className="bg-secondary-darker rounded-lg p-4 text-center">
                        <div className="text-sm text-white/70 mb-2">
                          {day.date}
                        </div>
                        <i
                          className={`wi ${getWeatherIcon(
                            day.description
                          )} text-3xl text-white`}></i>
                        <div className="font-semibold text-white mt-2">
                          {day.temp_min}° - {day.temp_max}°
                        </div>
                        <div className="text-sm text-white/70 mt-1">
                          {day.description}
                        </div>
                        <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
                          <div className="text-white/70">
                            <div>Humidity</div>
                            <div className="font-semibold text-white">
                              {day.humidity}%
                            </div>
                          </div>
                          <div className="text-white/70">
                            <div>Wind</div>
                            <div className="font-semibold text-white">
                              {day.windSpeed} km/h
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    7-Day Historical Weather
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-secondary-darker rounded-lg overflow-hidden">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="py-3 px-4 text-left text-white">
                            Date
                          </th>
                          <th className="py-3 px-4 text-left text-white">
                            Temperature
                          </th>
                          <th className="py-3 px-4 text-left text-white">
                            Condition
                          </th>
                          <th className="py-3 px-4 text-left text-white">
                            Humidity
                          </th>
                          <th className="py-3 px-4 text-left text-white">
                            Wind Speed
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {historicalData.map((day, index) => (
                          <tr key={index} className="border-b border-gray-700">
                            <td className="py-3 px-4 text-white">{day.date}</td>
                            <td className="py-3 px-4 text-white">
                              {day.temp}°C
                            </td>
                            <td className="py-3 px-4 text-white">
                              {day.description}
                            </td>
                            <td className="py-3 px-4 text-white">
                              {day.humidity}%
                            </td>
                            <td className="py-3 px-4 text-white">
                              {day.windSpeed} km/h
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-white mb-4">
                      Temperature Trend
                    </h3>
                    <div className="bg-secondary-darker rounded-lg p-4 h-64 flex items-end justify-around">
                      {historicalData.map((day, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div
                            className="w-12 bg-gradient-to-t from-blue-500 to-primary-light rounded-t-sm"
                            style={{ height: `${day.temp * 2}px` }}></div>
                          <div className="text-xs text-white/70 mt-2">
                            {day.date.split("/").slice(0, 2).join("/")}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CityWeatherPage;
