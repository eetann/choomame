import { RootState } from "../../app/store";
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
  "customLinkItem/initCustomLinkItem",
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
  "customLinkItem/fetchAllCustomLinkItems",
  async () => {
    return await customLinkItemsBucket.get();
  }
);

export const addManyCustomLinkItems = createAsyncThunk(
  "customLinkItem/addManyCustomLinkItems",
  async (args: { list_id: string; items: CustomLinkItems }) => {
    const customLinkItems = {} as CustomLinkItemsBucket;
    for (const item_id in args.items) {
      const item = args.items[item_id];
      // TODO:
      customLinkItems[`${args.list_id}/${item_id}`] = item;
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
  name: "customLinkItem",
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

export const selectCustomLinkItems =
  customLinkItemsAdapter.getSelectors<RootState>(
    (state) => state.customLinkItem
  );

export default customLinkItemSlice.reducer;
