import appearanceReducer from "../features/appearance/appearanceSlice";
import customLinkItemReducer from "../features/customLink/customLinkItemSlice";
import customLinkListReducer from "../features/customLink/customLinkListSlice";
import languagesReducer from "../features/languages/languagesSlice";
import timesReducer from "../features/times/timesSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    times: timesReducer,
    languages: languagesReducer,
    appearance: appearanceReducer,
    customLinkList: customLinkListReducer,
    customLinkItem: customLinkItemReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
