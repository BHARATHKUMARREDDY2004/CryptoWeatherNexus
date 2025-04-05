const initialState = {
  articles: [],
  loading: false,
  error: null
};

export default function newsReducer(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_NEWS_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_NEWS_SUCCESS':
      return {
        ...state,
        loading: false,
        articles: action.payload
      };
    case 'FETCH_NEWS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
}
