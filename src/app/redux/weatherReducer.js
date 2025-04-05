const initialState = {
  weatherData: null,
  multiCityData: [],
  historyData: null,
  loading: false,
  error: null,
  searched: false,
  weatherAlerts: []
};

export default function weatherReducer(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_WEATHER_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'FETCH_WEATHER_SUCCESS':
      return {
        ...state,
        weatherData: action.payload,
        loading: false,
        searched: true,
      };
    case 'FETCH_WEATHER_FAILURE':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case 'FETCH_MULTIPLE_CITIES_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_MULTIPLE_CITIES_SUCCESS':
      return {
        ...state,
        loading: false,
        multiCityData: action.payload
      };
    case 'FETCH_MULTIPLE_CITIES_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'FETCH_HISTORY_SUCCESS':
      return {
        ...state,
        historyData: action.payload,
        loading: false,
      };
    case 'SIMULATE_WEATHER_ALERT':
      return {
        ...state,
        weatherAlerts: [action.payload, ...state.weatherAlerts].slice(0, 5)
      };
    case 'RESET_SEARCH':
      return {
        ...state,
        searched: false,
        weatherData: null,
      };
    case 'FETCH_WEATHER_HISTORY_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_WEATHER_HISTORY_SUCCESS':
      return {
        ...state,
        loading: false,
        historyData: action.payload
      };
    case 'FETCH_WEATHER_HISTORY_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
}
