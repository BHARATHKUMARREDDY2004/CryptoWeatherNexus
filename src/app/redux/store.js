import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import weatherReducer from './weatherReducer';
import newsReducer from './newsReducer';
import cryptoReducer from './cryptoReducer';
import userPreferencesReducer from './userPreferencesReducer';
import { savePreferencesMiddleware } from './userPreferencesActions';

const rootReducer = combineReducers({
  weather: weatherReducer,
  news: newsReducer,
  crypto: cryptoReducer,
  userPreferences: userPreferencesReducer
});

const store = createStore(
  rootReducer, 
  applyMiddleware(thunk, savePreferencesMiddleware)
);

export default store;
