const initialState = {
  favoriteCities: [],
  favoriteCryptos: ['bitcoin', 'ethereum', 'ripple'] // Default favorites
};

export default function userPreferencesReducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_FAVORITE_CITY':
      if (state.favoriteCities.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        favoriteCities: [...state.favoriteCities, action.payload]
      };
    case 'REMOVE_FAVORITE_CITY':
      return {
        ...state,
        favoriteCities: state.favoriteCities.filter(city => city !== action.payload)
      };
    case 'ADD_FAVORITE_CRYPTO':
      if (state.favoriteCryptos.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        favoriteCryptos: [...state.favoriteCryptos, action.payload]
      };
    case 'REMOVE_FAVORITE_CRYPTO':
      return {
        ...state,
        favoriteCryptos: state.favoriteCryptos.filter(crypto => crypto !== action.payload)
      };
    case 'LOAD_PREFERENCES':
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}
