// src/store/index.js
import { createStore, combineReducers } from 'redux';
import transactionReducer from './reducers/transactionReducer';

const rootReducer = combineReducers({
  transactions: transactionReducer,
});

const store = createStore(rootReducer);

export default store;