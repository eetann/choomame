import {
  customLinkItemsBucket,
  customLinkListBucket,
  customLinkOnInstalled,
} from "./customLink";
import {
  CustomLinkItemsBucket,
  CustomLinkListBucket,
} from "./customLinkSchema";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const initCustomLink = createAsyncThunk<{
  list: CustomLinkListBucket;
  items: CustomLinkItemsBucket;
}>("customLink/initCustomLink", async () => {
  await customLinkListBucket.clear();
  await customLinkItemsBucket.clear();
  customLinkOnInstalled();
  const list = await customLinkListBucket.get();
  const items = await customLinkItemsBucket.get();
  return { list, items };
});

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

export const fetchAllCustomLinkItems = createAsyncThunk<CustomLinkItemsBucket>(
  "customLink/fetchAllCustomLinkItems",
  async () => {
    const bucket = await customLinkItemsBucket.get();
    return bucket;
  }
);

export const addManyCustomLinkItems = createAsyncThunk(
  "customLink/addManyCustomLinkItems",
  async (arg: CustomLinkItemsBucket) => {
    customLinkItemsBucket.set(arg);
    return arg;
  }
);

const initialState = {
  list: {} as CustomLinkListBucket,
  items: {} as CustomLinkItemsBucket,
  status: "idle",
};

export const customLinkSlice = createSlice({
  name: "customLink",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(initCustomLink.pending, (state) => {
        state.status = "loading";
      })
      .addCase(initCustomLink.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(initCustomLink.fulfilled, (state, action) => {
        state.list = action.payload.list;
        state.items = action.payload.items;
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
      })
      .addCase(fetchAllCustomLinkItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllCustomLinkItems.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(fetchAllCustomLinkItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "idle";
      })
      .addCase(addManyCustomLinkItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addManyCustomLinkItems.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(addManyCustomLinkItems.fulfilled, (state, action) => {
        state.items = { ...state.items, ...action.payload };
        state.status = "idle";
      });
  },
});
