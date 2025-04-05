import websocketService from '../services/websocketService';

// Action creators
export const fetchCoinsStart = () => ({
  type: 'FETCH_COINS_START'
});

export const fetchCoinsSuccess = (coins) => ({
  type: 'FETCH_COINS_SUCCESS',
  payload: coins
});

export const fetchCoinsFailure = (error) => ({
  type: 'FETCH_COINS_FAILURE',
  payload: error
});

export const updateLivePrice = (data) => ({
  type: 'UPDATE_LIVE_PRICE',
  payload: data
});

export const selectCoin = (coin) => ({
  type: 'SELECT_COIN',
  payload: coin
});

export const fetchCoinDetailsSuccess = (details) => ({
  type: 'FETCH_COIN_DETAILS_SUCCESS',
  payload: details
});

export const fetchHistoricalDataSuccess = (data) => ({
  type: 'FETCH_HISTORICAL_DATA_SUCCESS',
  payload: data
});

export const addCryptoAlert = (alert) => ({
  type: 'ADD_CRYPTO_ALERT',
  payload: alert
});

export const fetchTrendingCoinsSuccess = (coins) => ({
  type: 'FETCH_TRENDING_COINS_SUCCESS',
  payload: coins
});

export const setPriceAlert = (coinId, type, price) => ({
  type: 'SET_PRICE_ALERT',
  payload: { coinId, type, price }
});

export const removePriceAlert = (coinId, type) => ({
  type: 'REMOVE_PRICE_ALERT',
  payload: { coinId, type }
});

export const clearAllAlerts = () => ({
  type: 'CLEAR_ALL_ALERTS'
});

export const fetchPredictionSuccess = (data) => ({
  type: 'FETCH_PREDICTION_SUCCESS',
  payload: data
});

// Add a cache timestamp to track when we last fetched data
let lastFetchTimestamp = 0;
const CACHE_DURATION = 60000; // 60 seconds cache duration

// Thunk action creators
export const fetchCoins = (ids = 'bitcoin,ethereum,ripple') => {
  return async (dispatch, getState) => {
    const currentTime = Date.now();
    const { crypto } = getState();
    
    // Check if we already have these coins and if the cache is still valid
    if (crypto.coins.length > 0 && 
        currentTime - lastFetchTimestamp < CACHE_DURATION) {
      // If requesting specific coins for favorites view, filter from existing coins
      if (ids !== 'bitcoin,ethereum,ripple,solana,cardano') {
        const requestedIds = ids.split(',');
        const filteredCoins = crypto.coins.filter(coin => 
          requestedIds.includes(coin.id)
        );
        
        // If we have all the requested coins, use the cached data
        if (filteredCoins.length === requestedIds.length) {
          return;
        }
      } else {
        // For default view, use cached data
        return;
      }
    }
    
    dispatch(fetchCoinsStart());
    try {
      const response = await fetch(`/api/crypto?ids=${ids}`);
      if (!response.ok) {
        throw new Error('Failed to fetch crypto data');
      }
      const data = await response.json();
      dispatch(fetchCoinsSuccess(data.coins));
      
      // Update cache timestamp
      lastFetchTimestamp = currentTime;
      
      // Connect to WebSocket for real-time updates if not already connected
      if (!window.cryptoWebSocketConnected) {
        websocketService.connect();
        window.cryptoWebSocketConnected = true;
        
        // Setup WebSocket listener for price updates
        websocketService.addEventListener('priceUpdate', (priceData) => {
          dispatch(updateLivePrice(priceData));
        });
      }
    } catch (error) {
      dispatch(fetchCoinsFailure(error.message));
      
      // Retry after a delay if we hit rate limits
      if (error.message.includes('fetch')) {
        setTimeout(() => {
          dispatch(fetchCoins(ids));
        }, 5000);
      }
    }
  };
};

export const fetchCoinDetails = (id) => {
  return async (dispatch) => {
    try {
      const response = await fetch(`/api/crypto/details?id=${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch coin details');
      }
      const data = await response.json();
      dispatch(fetchCoinDetailsSuccess(data.data));
    } catch (error) {
      console.error('Error fetching coin details:', error);
    }
  };
};

export const fetchHistoricalData = (id, days = 7) => {
  return async (dispatch) => {
    try {
      const response = await fetch(`/api/crypto/history?id=${id}&days=${days}`);
      if (!response.ok) {
        throw new Error('Failed to fetch historical data');
      }
      const data = await response.json();
      dispatch(fetchHistoricalDataSuccess(data.data));
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
  };
};

export const simulatePriceAlert = (coin, price, change) => {
  return (dispatch) => {
    const alert = {
      type: 'price',
      coin,
      price,
      change,
      message: `${coin} price ${change > 0 ? 'increased' : 'decreased'} by ${Math.abs(change).toFixed(2)}%`,
      timestamp: new Date().toISOString()
    };
    
    dispatch(addCryptoAlert(alert));
  };
};

export const fetchTrendingCoins = () => {
  return async (dispatch) => {
    try {
      const response = await fetch('/api/crypto/trending');
      if (!response.ok) {
        throw new Error('Failed to fetch trending coins');
      }
      const data = await response.json();
      dispatch(fetchTrendingCoinsSuccess(data.coins));
    } catch (error) {
      console.error('Error fetching trending coins:', error);
    }
  };
};

export const fetchPricePrediction = (id) => {
  return async (dispatch) => {
    try {
      const response = await fetch(`/api/crypto/prediction?id=${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch price prediction');
      }
      const data = await response.json();
      dispatch(fetchPredictionSuccess(data.data));
    } catch (error) {
      console.error('Error fetching price prediction:', error);
    }
  };
};

// Enhanced price alert check that runs on each price update
export const checkPriceAlerts = () => {
  return (dispatch, getState) => {
    const { crypto } = getState();
    const { coins, liveData, priceAlertSettings } = crypto;
    
    Object.entries(priceAlertSettings).forEach(([coinId, settings]) => {
      const coin = coins.find(c => c.id === coinId);
      if (!coin) return;
      
      const currentPrice = liveData[coinId] 
        ? parseFloat(liveData[coinId]) 
        : coin.current_price;
      
      if (settings.above && currentPrice >= settings.above) {
        const alert = {
          type: 'priceAlert',
          alertType: 'above',
          coin: coin.name,
          price: currentPrice,
          threshold: settings.above,
          message: `${coin.name} price is now above ${settings.above}USD (${currentPrice}USD)`,
          timestamp: new Date().toISOString()
        };
        dispatch(addCryptoAlert(alert));
        // Remove the alert setting after it's triggered
        dispatch(removePriceAlert(coinId, 'above'));
      }
      
      if (settings.below && currentPrice <= settings.below) {
        const alert = {
          type: 'priceAlert',
          alertType: 'below',
          coin: coin.name,
          price: currentPrice,
          threshold: settings.below,
          message: `${coin.name} price is now below ${settings.below}USD (${currentPrice}USD)`,
          timestamp: new Date().toISOString()
        };
        dispatch(addCryptoAlert(alert));
        // Remove the alert setting after it's triggered
        dispatch(removePriceAlert(coinId, 'below'));
      }
    });
  };
};
