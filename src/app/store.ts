import timeReducer from "../features/time/timeSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    time: timeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
