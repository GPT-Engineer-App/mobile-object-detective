import { configureStore } from '@reduxjs/toolkit';
import detectionReducer from './slices/detectionSlice';

export const store = configureStore({
  reducer: {
    detection: detectionReducer,
  },
});

export default store;