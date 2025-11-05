import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import pipelineReducer from "./slices/pipelineSlice";
import dashboardReducer from "./slices/dashboardSlice";
import settingsReducer from "./slices/settingsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pipeline: pipelineReducer,
    dashboard: dashboardReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
