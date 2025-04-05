// Action creators
export const addFavoriteCity = (city) => ({
  type: 'ADD_FAVORITE_CITY',
  payload: city
});

export const removeFavoriteCity = (city) => ({
  type: 'REMOVE_FAVORITE_CITY',
  payload: city
});

export const addFavoriteCrypto = (crypto) => ({
  type: 'ADD_FAVORITE_CRYPTO',
  payload: crypto
});

export const removeFavoriteCrypto = (crypto) => ({
  type: 'REMOVE_FAVORITE_CRYPTO',
  payload: crypto
});

export const loadPreferences = (preferences) => ({
  type: 'LOAD_PREFERENCES',
  payload: preferences
});

// Thunk action creators
export const savePreferencesToLocalStorage = () => {
  return (dispatch, getState) => {
    const { userPreferences } = getState();
    localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
  };
};

export const loadPreferencesFromLocalStorage = () => {
  return (dispatch) => {
    try {
      const savedPreferences = localStorage.getItem('userPreferences');
      if (savedPreferences) {
        dispatch(loadPreferences(JSON.parse(savedPreferences)));
      }
    } catch (error) {
      console.error('Error loading preferences from localStorage:', error);
    }
  };
};

// Middleware function to save preferences on every change
export const savePreferencesMiddleware = store => next => action => {
  const result = next(action);
  
  // Save after any action that modifies preferences
  if (
    action.type === 'ADD_FAVORITE_CITY' || 
    action.type === 'REMOVE_FAVORITE_CITY' ||
    action.type === 'ADD_FAVORITE_CRYPTO' ||
    action.type === 'REMOVE_FAVORITE_CRYPTO'
  ) {
    const { userPreferences } = store.getState();
    localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
  }
  
  return result;
};
