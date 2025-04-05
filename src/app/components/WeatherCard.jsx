import React from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { FaHeart, FaRegHeart, FaArrowRight } from "react-icons/fa";
import {
  addFavoriteCity,
  removeFavoriteCity,
} from "../redux/userPreferencesActions";

const WeatherCard = ({ data, isFavorite }) => {
  const dispatch = useDispatch();

  if (!data || !data.weather || !data.weather[0]) {
    return null;
  }

  const kelvinToCelsius = (kelvin) => {
    return (kelvin - 273.15).toFixed(1);
  };

  const getWeatherIcon = (code) => {
    // Map weather codes to wi weather icons
    const codeMap = {
      "01d": "wi-day-sunny",
      "01n": "wi-night-clear",
      "02d": "wi-day-cloudy",
      "02n": "wi-night-cloudy",
      "03d": "wi-cloud",
      "03n": "wi-cloud",
      "04d": "wi-cloudy",
      "04n": "wi-cloudy",
      "09d": "wi-day-showers",
      "09n": "wi-night-showers",
      "10d": "wi-day-rain",
      "10n": "wi-night-rain",
      "11d": "wi-day-thunderstorm",
      "11n": "wi-night-thunderstorm",
      "13d": "wi-day-snow",
      "13n": "wi-night-snow",
      "50d": "wi-day-fog",
      "50n": "wi-night-fog",
    };

    return codeMap[code] || "wi-day-cloudy";
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavoriteCity(data.name));
    } else {
      dispatch(addFavoriteCity(data.name));
    }
  };

  const iconClass = getWeatherIcon(data.weather[0].icon);

  return (
    <div className="bg-secondary-darker rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="p-5">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">{data.name}</h3>
            <p className="text-xs text-white/60">
              {data.sys?.country && `${data.sys.country}`}
            </p>
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

        <div className="flex justify-between items-center">
          <div className="text-center">
            <i className={`wi ${iconClass} text-4xl text-white`}></i>
            <p className="text-sm text-white/70 capitalize mt-1">
              {data.weather[0].description}
            </p>
          </div>

          <div className="text-right">
            <div className="text-3xl font-bold text-white">
              {kelvinToCelsius(data.main.temp)}°C
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
          <div className="bg-black/20 rounded-md p-2">
            <span className="text-white/60">Humidity</span>
            <p className="text-white font-medium">{data.main.humidity}%</p>
          </div>
          <div className="bg-black/20 rounded-md p-2">
            <span className="text-white/60">Wind</span>
            <p className="text-white font-medium">
              {(data.wind.speed * 3.6).toFixed(1)} km/h
            </p>
          </div>
        </div>
      </div>

      <Link
        href={`/weather/${encodeURIComponent(data.name)}`}
        className="block bg-primary-darker text-white py-3 px-4 text-center text-sm group hover:bg-primary-dark transition-colors">
        <span className="flex items-center justify-center gap-2">
          <span>View Forecast</span>
          <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
        </span>
      </Link>
    </div>
  );
};

export default WeatherCard;
