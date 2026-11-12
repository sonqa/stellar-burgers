import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './ingredientsSlice';
import constructorReducer from './constructorSlice';
import orderReducer from './orderSlice';
import ordersReducer from './ordersSlice';
import userReducer from './userSlice';
import feedReducer from './feedSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer, 
  orders: ordersReducer,
  user: userReducer,
  feed: feedReducer,
});