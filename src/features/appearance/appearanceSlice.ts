import { getBucket } from "@extend-chrome/storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export type AppearanceBucket = {
  location: "top-right" | "bottom-right";
};

const appearanceBucket = getBucket<AppearanceBucket>("appearance");

const initialAppearanceStorage: AppearanceBucket = {
  location: "top-right",
};

export async function appearanceOnInstalled() {
  const bucket = await appearanceBucket.get();
  if (Object.keys(bucket).length === 0) {
    appearanceBucket.set(initialAppearanceStorage);
  }
}

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

const initialState = {
  appearance: initialAppearanceStorage,
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
        state.appearance = action.payload;
        state.status = "idle";
      })
      .addCase(fetchAllAppearance.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllAppearance.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(fetchAllAppearance.fulfilled, (state, action) => {
        state.appearance = action.payload;
        state.status = "idle";
      });
  },
});

export default appearanceSlice.reducer;
