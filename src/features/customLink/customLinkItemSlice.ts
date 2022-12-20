import {
  customLinkItemsBucket,
  customLinkItemsOnInstalled,
} from "./customLink";
import {
  CustomLinkItem,
  CustomLinkItems,
  CustomLinkItemsBucket,
} from "./customLinkSchema";
import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";

export const initCustomLinkItem = createAsyncThunk<CustomLinkItemsBucket>(
  "customLink/initCustomLinkItem",
  async () => {
    await customLinkItemsBucket.clear();
    customLinkItemsOnInstalled();
    return await customLinkItemsBucket.get();
  }
);

const customLinkItemsAdapter = createEntityAdapter<CustomLinkItem>({
  selectId: (item) => item.id,
  sortComparer: (a, b) => {
    if (a.target < b.target) {
      // a, b
      return -1;
    }
    return 1;
  },
});

export const fetchAllCustomLinkItems = createAsyncThunk<CustomLinkItemsBucket>(
  "customLink/fetchAllCustomLinkItems",
  async () => {
    return await customLinkItemsBucket.get();
  }
);

export const addManyCustomLinkItems = createAsyncThunk(
  "customLink/addManyCustomLinkItems",
  async (arg: CustomLinkItems) => {
    const customLinkItems = {} as CustomLinkItemsBucket;
    for (const item_id in arg) {
      const customLink = arg[item_id];
      customLinkItems[`${customLink.list_id}/${item_id}`] = customLink;
    }
    customLinkItemsBucket.set(customLinkItems);
    return customLinkItems;
  }
);

export const removeManyCustomLinkItems = createAsyncThunk(
  "customLink/removdeManyCustomLinkItems",
  async (customLinkItemIds: string[]) => {
    customLinkItemsBucket.remove(customLinkItemIds);
    return customLinkItemIds;
  }
);

const initialState = customLinkItemsAdapter.getInitialState({
  status: "idle",
});

export const customLinkItemSlice = createSlice({
  name: "customLink",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // init
      .addCase(initCustomLinkItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(initCustomLinkItem.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(initCustomLinkItem.fulfilled, (state, action) => {
        customLinkItemsAdapter.setAll(state, action.payload);
        state.status = "idle";
      })
      // fetch
      .addCase(fetchAllCustomLinkItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllCustomLinkItems.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(fetchAllCustomLinkItems.fulfilled, (state, action) => {
        customLinkItemsAdapter.setAll(state, action.payload);
        state.status = "idle";
      })
      // addMany
      .addCase(addManyCustomLinkItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addManyCustomLinkItems.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(addManyCustomLinkItems.fulfilled, (state, action) => {
        customLinkItemsAdapter.addMany(state, action.payload);
        state.status = "idle";
      })
      // removeMany
      .addCase(removeManyCustomLinkItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeManyCustomLinkItems.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(removeManyCustomLinkItems.fulfilled, (state, action) => {
        customLinkItemsAdapter.removeMany(state, action.payload);
        state.status = "idle";
      });
  },
});

export default customLinkItemSlice.reducer;
