import paramReducer from "../features/param/paramSlice";
import timesReducer from "../features/times/timesSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    param: paramReducer,
    times: timesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
