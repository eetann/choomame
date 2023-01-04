import {
  appearanceBucket,
  AppearanceBucket,
  initialAppearanceStorage,
  LocationType,
} from "./appearance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const initAppearance = createAsyncThunk<AppearanceBucket>(
  "appearance/initAppearance",
  async () => {
    await appearanceBucket.clear();
    return await appearanceBucket.set(initialAppearanceStorage);
  }
);

export const fetchAllAppearance = createAsyncThunk<AppearanceBucket>(
  "appearance/fetchAllAppearance",
  async () => {
    return await appearanceBucket.get();
  }
);

export const updateLocation = createAsyncThunk(
  "appearance/updateLocation",
  async (arg: LocationType) => {
    appearanceBucket.set({ location: arg });
    return arg;
  }
);

const initialState = {
  bucket: initialAppearanceStorage,
  status: "idle",
};

export const appearanceSlice = createSlice({
  name: "appearance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(initAppearance.pending, (state) => {
        state.status = "loading";
      })
      .addCase(initAppearance.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(initAppearance.fulfilled, (state, action) => {
        state.bucket = action.payload;
        state.status = "idle";
      })
      .addCase(fetchAllAppearance.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllAppearance.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(fetchAllAppearance.fulfilled, (state, action) => {
        state.bucket = action.payload;
        state.status = "idle";
      })
      .addCase(updateLocation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateLocation.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(updateLocation.fulfilled, (state, action) => {
        state.bucket.location = action.payload;
        state.status = "idle";
      });
  },
});

export default appearanceSlice.reducer;
