import { customLinkListBucket, customLinkListOnInstalled } from "./customLink";
import { CustomLinkListBucket } from "./customLinkSchema";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const initCustomLinkList = createAsyncThunk<CustomLinkListBucket>(
  "customLink/initCustomLinkList",
  async () => {
    await customLinkListBucket.clear();
    customLinkListOnInstalled();
    return await customLinkListBucket.get();
  }
);

export const fetchAllCustomLinkList = createAsyncThunk<CustomLinkListBucket>(
  "customLink/fetchAllCustomLinkList",
  async () => {
    const bucket = await customLinkListBucket.get();
    return bucket;
  }
);

export const addOneCustomLinkList = createAsyncThunk(
  "customLink/addOneCustomLinkList",
  async (arg: CustomLinkListBucket) => {
    customLinkListBucket.set(arg);
    return arg;
  }
);

export const removeOneCustomLinkList = createAsyncThunk(
  "customLink/removeOneCustomLinkList",
  async (list_id: string) => {
    customLinkListBucket.remove(list_id);
    return list_id;
  }
);

const initialState = {
  list: {} as CustomLinkListBucket,
  status: "idle",
};

export const customLinkSlice = createSlice({
  name: "customLink",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(initCustomLinkList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(initCustomLinkList.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(initCustomLinkList.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = "idle";
      })
      .addCase(fetchAllCustomLinkList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllCustomLinkList.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(fetchAllCustomLinkList.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = "idle";
      })
      .addCase(addOneCustomLinkList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addOneCustomLinkList.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(addOneCustomLinkList.fulfilled, (state, action) => {
        const list_id = Object.keys(action.payload)[0];
        state.list[list_id] = action.payload[list_id];
        state.status = "idle";
      })
      .addCase(removeOneCustomLinkList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeOneCustomLinkList.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(removeOneCustomLinkList.fulfilled, (state, action) => {
        delete state.list[action.payload];
        state.status = "idle";
      });
  },
});
