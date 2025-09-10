import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import pipelineReducer from './slices/pipelineSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pipeline: pipelineReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;