import { RootState } from "../../app/store";
import {
  customLinkItemBucket,
  customLinkItemOnInstalled,
  updateCustomLinks,
} from "./customLink";
import {
  CustomLinkItem,
  CustomLinkItemList,
  CustomLinkItemBucket,
  CustomLinkItemWithoutId,
} from "./customLinkSchema";
import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  nanoid,
} from "@reduxjs/toolkit";

export const initCustomLinkItem = createAsyncThunk<CustomLinkItemBucket>(
  "customLinkItem/initCustomLinkItem",
  async () => {
    await customLinkItemBucket.clear();
    await customLinkItemOnInstalled();
    return await customLinkItemBucket.get();
  }
);

const customLinkItemAdapter = createEntityAdapter<CustomLinkItem>({
  selectId: (item) => item.id,
  sortComparer: (a, b) => {
    if (a.group < b.group) {
      // a, b
      return -1;
    } else if (a.group > b.group) {
      // b, a
      return 1;
    }
    if (a.name < b.name) {
      // a, b
      return -1;
    }
    return 1;
  },
});

export const fetchAllCustomLinkItem = createAsyncThunk<CustomLinkItemBucket>(
  "customLinkItem/fetchAllCustomLinkItem",
  async () => {
    return await customLinkItemBucket.get();
  }
);

export const toggleOneCustomLinkItem = createAsyncThunk(
  "customLinkItem/toggleOneCustomLinkItem",
  async (args: CustomLinkItem) => {
    const customLink: CustomLinkItem = { ...args, enable: !args.enable };
    customLinkItemBucket.set({ [customLink.id]: customLink });
    return customLink;
  }
);

export const disableManyCustomLinkItem = createAsyncThunk(
  "customLinkItem/disableManyCustomLinkItem",
  async (disableIds: string[]) => {
    const bucket = await customLinkItemBucket.get();
    return await Promise.all(
      disableIds.flatMap((id) => {
        const item = bucket[id];
        if (!item) {
          return [];
        }
        const customLink: CustomLinkItem = { ...item, enable: false };
        customLinkItemBucket.set({ [customLink.id]: customLink });
        return { id: customLink.id, changes: customLink };
      })
    );
  }
);

export const addOneCustomLinkItem = createAsyncThunk(
  "customLinkItem/addOneCustomLinkItem",
  async (item: CustomLinkItemWithoutId) => {
    const collectionId = "user";
    const id = `${collectionId}/${nanoid()}`;
    const customLink = { id, ...item };
    customLinkItemBucket.set({ [id]: customLink });
    return customLink;
  }
);

export const addManyCustomLinkItem = createAsyncThunk(
  "customLinkItem/addManyCustomLinkItem",
  async (args: { items: CustomLinkItemList; collectionId: string }) => {
    const customLinks = {} as CustomLinkItemBucket;
    for (const item of args.items) {
      if (!item.id.startsWith(args.collectionId)) {
        item.id = `${args.collectionId}/${item.id}`;
      }
      customLinks[item.id] = item;
    }
    customLinkItemBucket.set(customLinks);
    return customLinks;
  }
);

export const removeManyCustomLinkItem = createAsyncThunk(
  "customLink/removeManyCustomLinkItem",
  async (customLinkIds: string[]) => {
    await customLinkItemBucket.remove(customLinkIds);
    return customLinkIds;
  }
);

export const updateManyCustomLinkItem = createAsyncThunk(
  "customLinkItem/updateManyCustomLinkItem",
  async (
    args: {
      beforeCustomLinkBucket: CustomLinkItemBucket;
      updateItems: CustomLinkItem[];
      collectionId: string;
    },
    { dispatch }
  ) => {
    const deleteFunction = async (beforeOnlyIds: string[]) => {
      await dispatch(removeManyCustomLinkItem(beforeOnlyIds));
    };
    return await updateCustomLinks(
      args.beforeCustomLinkBucket,
      args.updateItems,
      args.collectionId,
      deleteFunction
    );
  }
);

const initialState = customLinkItemAdapter.getInitialState({
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
        customLinkItemAdapter.setAll(state, action.payload);
        state.status = "idle";
      })
      // fetch
      .addCase(fetchAllCustomLinkItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllCustomLinkItem.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(fetchAllCustomLinkItem.fulfilled, (state, action) => {
        customLinkItemAdapter.setAll(state, action.payload);
        state.status = "idle";
      })
      // toggle enable
      .addCase(toggleOneCustomLinkItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(toggleOneCustomLinkItem.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(toggleOneCustomLinkItem.fulfilled, (state, action) => {
        customLinkItemAdapter.updateOne(state, {
          id: action.payload.id,
          changes: action.payload,
        });
        state.status = "idle";
      })
      // disable enable
      .addCase(disableManyCustomLinkItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(disableManyCustomLinkItem.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(disableManyCustomLinkItem.fulfilled, (state, action) => {
        customLinkItemAdapter.updateMany(state, action.payload);
        state.status = "idle";
      })
      // addOne
      .addCase(addOneCustomLinkItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addOneCustomLinkItem.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(addOneCustomLinkItem.fulfilled, (state, action) => {
        customLinkItemAdapter.addOne(state, action.payload);
        state.status = "idle";
      })
      // addMany
      .addCase(addManyCustomLinkItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addManyCustomLinkItem.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(addManyCustomLinkItem.fulfilled, (state, action) => {
        customLinkItemAdapter.addMany(state, action.payload);
        state.status = "idle";
      })
      // updateMany
      .addCase(updateManyCustomLinkItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateManyCustomLinkItem.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(updateManyCustomLinkItem.fulfilled, (state, action) => {
        customLinkItemAdapter.upsertMany(state, action.payload);
        state.status = "idle";
      })
      // removeMany
      .addCase(removeManyCustomLinkItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeManyCustomLinkItem.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(removeManyCustomLinkItem.fulfilled, (state, action) => {
        customLinkItemAdapter.removeMany(state, action.payload);
        state.status = "idle";
      });
  },
});

export const selectCustomLinkItem =
  customLinkItemAdapter.getSelectors<RootState>(
    (state) => state.customLinkItem
  );

export default customLinkItemSlice.reducer;
