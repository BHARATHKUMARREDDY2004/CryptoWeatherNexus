"use client";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchWeatherHistory } from "../../redux/weatherActions";

const HistoryPage = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { historyData, loading, error } = useSelector((state) => state.weather);
  const { city } = params;

  useEffect(() => {
    if (city) {
      dispatch(fetchWeatherHistory(city));
    }
  }, [city, dispatch]);

  // Helper function to convert Kelvin to Celsius
  const kelvinToCelsius = (kelvin) => {
    return (kelvin - 273.15).toFixed(1);
  };

  // Group forecast data by day
  const groupByDay = (data) => {
    if (!data || !data.list) return [];

    const groupedData = {};

    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString();

      if (!groupedData[day]) {
        groupedData[day] = [];
      }

      groupedData[day].push(item);
    });

    return Object.entries(groupedData).map(([day, items]) => {
      // Calculate daily average
      const avgTemp =
        items.reduce((sum, item) => sum + item.main.temp, 0) / items.length;
      const avgHumidity =
        items.reduce((sum, item) => sum + item.main.humidity, 0) / items.length;

      return {
        day,
        items,
        avgTemp,
        avgHumidity,
        // Get common weather condition (most frequent)
        condition: getMostFrequentCondition(items),
      };
    });
  };

  // Get most frequent weather condition from list of items
  const getMostFrequentCondition = (items) => {
    const conditions = {};
    items.forEach((item) => {
      const condition = item.weather[0].main;
      conditions[condition] = (conditions[condition] || 0) + 1;
    });

    return Object.entries(conditions).sort((a, b) => b[1] - a[1])[0][0];
  };

  const groupedData = historyData ? groupByDay(historyData) : [];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen">
      <div className="flex items-center mb-8">
        <button
          className="bg-primary-light hover:bg-primary text-white px-5 py-2 rounded-full mr-4 transition-colors duration-300"
          onClick={() => router.back()}>
          &larr; Back
        </button>
        <h1 className="text-2xl md:text-3xl">
          5-Day Weather History for {city}
        </h1>
      </div>

      {loading ? (
        <div className="text-center py-8 text-xl">
          Loading weather history...
        </div>
      ) : error ? (
        <div className="text-center py-8 bg-red-500/20 rounded-lg">
          <p className="text-lg">Error: {error}</p>
          <p>Unable to fetch weather history for {city}</p>
        </div>
      ) : (
        <>
          <div className="mb-12 overflow-x-auto">
            <table className="w-full bg-white/10 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-black/20">
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Avg. Temperature</th>
                  <th className="p-4 text-left">Avg. Humidity</th>
                  <th className="p-4 text-left">Condition</th>
                </tr>
              </thead>
              <tbody>
                {groupedData.map((day, index) => (
                  <tr
                    key={index}
                    className="border-b border-white/10 hover:bg-white/5 transition-colors duration-200">
                    <td className="p-4">{day.day}</td>
                    <td className="p-4">{kelvinToCelsius(day.avgTemp)}°C</td>
                    <td className="p-4">{day.avgHumidity.toFixed(0)}%</td>
                    <td className="p-4">{day.condition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl mb-4">Temperature Trend</h2>
            <div className="flex justify-around items-end h-64 bg-white/10 rounded-lg p-5">
              {groupedData.map((day, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="w-10 bg-gradient-to-t from-primary-light to-primary-dark rounded-t-md transition-all duration-500"
                    style={{
                      height: `${kelvinToCelsius(day.avgTemp) * 4}px`,
                    }}></div>
                  <div className="mt-2 text-sm">
                    {day.day.split("/").slice(0, 2).join("/")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl mb-4">Hourly Breakdown</h2>
            <div className="flex justify-center gap-2 mb-6 flex-wrap">
              {groupedData.map((day, index) => (
                <button
                  key={index}
                  className="bg-primary-dark hover:bg-primary-light px-4 py-2 rounded-full text-sm transition-colors duration-300"
                  onClick={() =>
                    document
                      .getElementById(`day-${index}`)
                      .scrollIntoView({ behavior: "smooth" })
                  }>
                  {day.day.split("/").slice(0, 2).join("/")}
                </button>
              ))}
            </div>

            {groupedData.map((day, dayIndex) => (
              <div
                key={dayIndex}
                id={`day-${dayIndex}`}
                className="mb-10 bg-white/10 rounded-lg p-6">
                <h3 className="text-xl mb-4">{day.day}</h3>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {day.items.map((item, itemIndex) => {
                    const time = new Date(item.dt * 1000).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" }
                    );
                    return (
                      <div
                        key={itemIndex}
                        className="min-w-[120px] bg-black/20 rounded-lg p-4 text-center">
                        <div className="font-bold mb-2">{time}</div>
                        <div className="text-xl mb-2">
                          {kelvinToCelsius(item.main.temp)}°C
                        </div>
                        <div className="capitalize mb-1 text-sm">
                          {item.weather[0].description}
                        </div>
                        <div className="text-sm opacity-80">
                          Humidity: {item.main.humidity}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HistoryPage;
