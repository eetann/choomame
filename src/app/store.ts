import appearanceReducer from "../features/appearance/appearanceSlice";
import languagesReducer from "../features/languages/languagesSlice";
import timesReducer from "../features/times/timesSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    times: timesReducer,
    languages: languagesReducer,
    appearance: appearanceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
