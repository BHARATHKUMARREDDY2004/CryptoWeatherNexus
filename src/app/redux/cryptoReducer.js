const initialState = {
  coins: [],
  trendingCoins: [],
  liveData: {},
  selectedCoin: null,
  coinDetails: null,
  historicalData: null,
  loading: false,
  error: null,
  alerts: [],
  priceAlertSettings: {}, // Format: {coinId: {above: price, below: price}}
  predictionData: null
};

export default function cryptoReducer(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_COINS_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_COINS_SUCCESS':
      return {
        ...state,
        loading: false,
        coins: action.payload
      };
    case 'FETCH_COINS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'UPDATE_LIVE_PRICE':
      return {
        ...state,
        liveData: { ...state.liveData, ...action.payload }
      };
    case 'SELECT_COIN':
      return {
        ...state,
        selectedCoin: action.payload
      };
    case 'FETCH_COIN_DETAILS_SUCCESS':
      return {
        ...state,
        coinDetails: action.payload
      };
    case 'FETCH_HISTORICAL_DATA_SUCCESS':
      return {
        ...state,
        historicalData: action.payload
      };
    case 'ADD_CRYPTO_ALERT':
      return {
        ...state,
        alerts: [action.payload, ...state.alerts].slice(0, 5) // Keep only the 5 most recent alerts
      };
    case 'FETCH_TRENDING_COINS_SUCCESS':
      return {
        ...state,
        trendingCoins: action.payload
      };
    case 'SET_PRICE_ALERT':
      return {
        ...state,
        priceAlertSettings: {
          ...state.priceAlertSettings,
          [action.payload.coinId]: {
            ...state.priceAlertSettings[action.payload.coinId],
            [action.payload.type]: action.payload.price
          }
        }
      };
    case 'REMOVE_PRICE_ALERT':
      const updatedSettings = { ...state.priceAlertSettings };
      if (updatedSettings[action.payload.coinId]) {
        delete updatedSettings[action.payload.coinId][action.payload.type];
        // Remove the coin entry if no alerts remain
        if (Object.keys(updatedSettings[action.payload.coinId]).length === 0) {
          delete updatedSettings[action.payload.coinId];
        }
      }
      return {
        ...state,
        priceAlertSettings: updatedSettings
      };
    case 'CLEAR_ALL_ALERTS':
      return {
        ...state,
        alerts: []
      };
    case 'FETCH_PREDICTION_SUCCESS':
      return {
        ...state,
        predictionData: action.payload
      };
    default:
      return state;
  }
}
