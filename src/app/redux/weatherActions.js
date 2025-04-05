// Action creators
export const fetchWeatherStart = () => ({
  type: 'FETCH_WEATHER_START',
});

export const fetchWeatherSuccess = (data) => ({
  type: 'FETCH_WEATHER_SUCCESS',
  payload: data,
});

export const fetchWeatherFailure = (error) => ({
  type: 'FETCH_WEATHER_FAILURE',
  payload: error,
});

export const fetchPredefinedCitiesSuccess = (data) => ({
  type: 'FETCH_PREDEFINED_CITIES_SUCCESS',
  payload: data,
});

export const fetchHistorySuccess = (data) => ({
  type: 'FETCH_HISTORY_SUCCESS',
  payload: data,
});

export const resetSearch = () => ({
  type: 'RESET_SEARCH',
});

export const fetchMultipleCitiesStart = () => ({
  type: 'FETCH_MULTIPLE_CITIES_START'
});

export const fetchMultipleCitiesSuccess = (data) => ({
  type: 'FETCH_MULTIPLE_CITIES_SUCCESS',
  payload: data
});

export const fetchMultipleCitiesFailure = (error) => ({
  type: 'FETCH_MULTIPLE_CITIES_FAILURE',
  payload: error
});

export const simulateWeatherAlert = (city, alertType) => ({
  type: 'SIMULATE_WEATHER_ALERT',
  payload: {
    city,
    alertType,
    message: `${alertType} alert for ${city}`,
    timestamp: new Date().toISOString()
  }
});

export const fetchWeatherHistoryStart = () => ({
  type: 'FETCH_WEATHER_HISTORY_START'
});

export const fetchWeatherHistorySuccess = (data) => ({
  type: 'FETCH_WEATHER_HISTORY_SUCCESS',
  payload: data
});

export const fetchWeatherHistoryFailure = (error) => ({
  type: 'FETCH_WEATHER_HISTORY_FAILURE',
  payload: error
});

// Thunk action creators
export const fetchWeatherByCity = (cityName) => {
  return async (dispatch) => {
    dispatch(fetchWeatherStart());
    try {
      const response = await fetch(
        `/api/weather?address=${encodeURIComponent(cityName)}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      const jsonData = (await response.json()).data;
      dispatch(fetchWeatherSuccess(jsonData));
    } catch (error) {
      dispatch(fetchWeatherFailure(error.message));
    }
  };
};

export const fetchWeatherByCoordinates = (latitude, longitude) => {
  return async (dispatch) => {
    dispatch(fetchWeatherStart());
    try {
      const response = await fetch(
        `http://localhost:3000/api/weather?lat=${latitude}&lon=${longitude}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      const jsonData = (await response.json()).data;
      dispatch(fetchWeatherSuccess(jsonData));
    } catch (error) {
      dispatch(fetchWeatherFailure(error.message));
    }
  };
};

export const fetchPredefinedCitiesData = (cities) => {
  return async (dispatch) => {
    try {
      const promises = cities.map(async (cityName) => {
        const response = await fetch(
          "http://localhost:3000/api/weather?address=" + cityName
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch data for ${cityName}`);
        }
        const jsonData = (await response.json()).data;
        return jsonData;
      });
      
      const citiesData = await Promise.all(promises);
      dispatch(fetchPredefinedCitiesSuccess(citiesData));
    } catch (error) {
      console.error("Error fetching predefined cities data:", error);
    }
  };
};

export const fetchWeatherHistory = (cityName) => {
  return async (dispatch) => {
    dispatch(fetchWeatherHistoryStart());
    try {
      // Try to fetch from real API first
      try {
        const response = await fetch(`/api/history?city=${encodeURIComponent(cityName)}`);
        
        if (response.ok) {
          const data = await response.json();
          dispatch(fetchWeatherHistorySuccess(data.data));
          return;
        }
      } catch (apiError) {
        console.warn("Failed to fetch from real API, using mock data instead:", apiError);
      }
      
      // Fallback to mock data if the API call fails
      // Generate mock historical data
      const today = new Date();
      const mockData = [];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        
        mockData.push({
          date: date.toLocaleDateString(),
          temp: Math.round(15 + Math.random() * 15),
          description: ['Clear', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Rain'][Math.floor(Math.random() * 5)],
          humidity: Math.round(40 + Math.random() * 40),
          windSpeed: (2 + Math.random() * 8).toFixed(1)
        });
      }
      
      dispatch(fetchWeatherHistorySuccess(mockData));
    } catch (error) {
      dispatch(fetchWeatherHistoryFailure(error.message));
    }
  };
};

export const fetchMultipleCities = (cities) => {
  return async (dispatch) => {
    dispatch(fetchMultipleCitiesStart());
    try {
      const promises = cities.map(async (city) => {
        const response = await fetch(`/api/weather?address=${encodeURIComponent(city)}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch data for ${city}`);
        }
        const jsonData = (await response.json()).data;
        return jsonData;
      });
      
      const results = await Promise.all(promises);
      dispatch(fetchMultipleCitiesSuccess(results.filter(Boolean)));
      
      // Randomly simulate weather alerts occasionally
      if (Math.random() < 0.1) { // 10% chance
        const randomCityIndex = Math.floor(Math.random() * cities.length);
        const randomCity = cities[randomCityIndex];
        const alertTypes = ['Heavy Rain', 'Thunderstorm', 'Extreme Heat', 'High Winds', 'Flood Warning'];
        const randomAlertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        
        dispatch(simulateWeatherAlert(randomCity, randomAlertType));
      }
      
    } catch (error) {
      dispatch(fetchMultipleCitiesFailure(error.message));
    }
  };
};
