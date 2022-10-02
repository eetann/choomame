import languagesReducer from "../features/languages/languagesSlice";
import paramReducer from "../features/param/paramSlice";
import timesReducer from "../features/times/timesSlice";
import appearanceReducer from "../features/appearance/appearanceSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    param: paramReducer,
    times: timesReducer,
    languages: languagesReducer,
    appearance: appearanceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
