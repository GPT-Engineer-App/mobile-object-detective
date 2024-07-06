import { configureStore } from '@reduxjs/toolkit';
import detectionReducer from './slices/detectionSlice';

const store = configureStore({
  reducer: {
    detection: detectionReducer,
  },
});

export default store;