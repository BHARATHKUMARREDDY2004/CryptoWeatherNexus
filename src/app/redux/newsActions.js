export const fetchNewsStart = () => ({
  type: 'FETCH_NEWS_START'
});

export const fetchNewsSuccess = (articles) => ({
  type: 'FETCH_NEWS_SUCCESS',
  payload: articles
});

export const fetchNewsFailure = (error) => ({
  type: 'FETCH_NEWS_FAILURE',
  payload: error
});

export const fetchCryptoNews = () => {
  return async (dispatch) => {
    dispatch(fetchNewsStart());
    
    try {
      const response = await fetch('/api/news');
      
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      
      const data = await response.json();
      dispatch(fetchNewsSuccess(data.news));
    } catch (error) {
      dispatch(fetchNewsFailure(error.message));
    }
  };
};
