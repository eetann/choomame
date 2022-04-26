import paramReducer from "../features/param/paramSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    param: paramReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
