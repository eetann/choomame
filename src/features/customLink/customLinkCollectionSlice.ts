import { RootState } from "../../app/store";
import {
  customLinkCollectionBucket,
  customLinkCollectionOnInstalled,
  customLinkItemBucket,
  fetchCustomLinkUrl,
  updateCustomLinkCollection,
} from "./customLink";
import {
  addManyCustomLinkItem,
  disableManyCustomLinkItem,
  initCustomLinkItem,
  removeManyCustomLinkItem,
  updateManyCustomLinkItem,
} from "./customLinkItemSlice";
import {
  CustomLinkRestoreJson,
  CustomLinkCollection,
  CustomLinkCollectionBucket,
  CustomLinkItemList,
  CustomLinkItemBucket,
  customLinkUrlSchema,
} from "./customLinkSchema";
import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  Update,
} from "@reduxjs/toolkit";

export const initCustomLinkCollection =
  createAsyncThunk<CustomLinkCollectionBucket>(
    "customLinkCollection/initCustomLinkCollection",
    async () => {
      await customLinkCollectionBucket.clear();
      customLinkCollectionOnInstalled();
      return await customLinkCollectionBucket.get();
    }
  );

export const initCustomLinkAll = createAsyncThunk<CustomLinkCollectionBucket>(
  "customLinkCollection/initCustomLinkAll",
  async (_, { dispatch }) => {
    await customLinkCollectionBucket.clear();
    await customLinkCollectionOnInstalled();
    await dispatch(initCustomLinkItem());
    return await customLinkCollectionBucket.get();
  }
);

const customLinkCollectionAdapter = createEntityAdapter<CustomLinkCollection>({
  selectId: (item) => item.id,
  sortComparer: (a, b) => {
    if (a.name < b.name) {
      // a, b
      return -1;
    }
    return 1;
  },
});

export const fetchAllCustomLinkCollection =
  createAsyncThunk<CustomLinkCollectionBucket>(
    "customLinkCollection/fetchAllCustomLinkCollection",
    async () => {
      const bucket = await customLinkCollectionBucket.get();
      return bucket;
    }
  );

export const addOneCustomLinkCollection = createAsyncThunk(
  "customLinkCollection/addOneCustomLinkCollection",
  async (arg: string, { dispatch }) => {
    const result = customLinkUrlSchema.safeParse(arg);
    if (!result.success) {
      throw new Error(result.error.issues[0].message);
    }
    const customLinkUrl = result.data;
    const response = await fetchCustomLinkUrl(customLinkUrl);
    const collectionId = response.id;
    const customLinkCollection: CustomLinkCollection = {
      id: collectionId,
      name: response.name,
      url: customLinkUrl,
    };
    customLinkCollectionBucket.set({ [collectionId]: customLinkCollection });
    await dispatch(
      addManyCustomLinkItem({
        items: response.items,
        collectionId: collectionId,
      })
    );
    return customLinkCollection;
  }
);

export const removeOneCustomLinkCollection = createAsyncThunk(
  "customLinkCollection/removeOneCustomLinkCollection",
  async (collectionId: string, { dispatch }) => {
    customLinkCollectionBucket.remove(collectionId);
    let customLinkItemIds = await customLinkItemBucket.getKeys();
    customLinkItemIds = customLinkItemIds.filter((item_id) =>
      item_id.startsWith(collectionId)
    );
    await dispatch(removeManyCustomLinkItem(customLinkItemIds));
    return collectionId;
  }
);

export const updateManyCustomLinkCollection = createAsyncThunk(
  "customLinkCollection/updateManyCustomLinkCollection",
  async (_, { dispatch }): Promise<Update<CustomLinkCollection>[]> => {
    const updateCustomLinksFunction = async (
      beforeCustomLinkBucket: CustomLinkItemBucket,
      updateItems: CustomLinkItemList,
      collectionId: string
    ) => {
      await dispatch(
        updateManyCustomLinkItem({
          beforeCustomLinkBucket,
          updateItems,
          collectionId: collectionId,
        })
      );
      return [];
    };
    return await updateCustomLinkCollection(updateCustomLinksFunction);
  }
);

export const restoreCustomLink = createAsyncThunk(
  "customLinkCollection/restoreCustomLink",
  async (customLinkBackupJson: CustomLinkRestoreJson, { dispatch }) => {
    for (const collection of customLinkBackupJson.collection) {
      await dispatch(addOneCustomLinkCollection(collection.url));
      await dispatch(disableManyCustomLinkItem(collection.disableIds));
    }
    const bucket = await customLinkCollectionBucket.get();
    return bucket;
  }
);

const initialState = customLinkCollectionAdapter.getInitialState({
  status: "idle",
  errorMessage: "",
});

export const customLinkCollectionSlice = createSlice({
  name: "customLinkCollection",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // init
      .addCase(initCustomLinkCollection.pending, (state) => {
        state.status = "loading";
        state.errorMessage = "";
      })
      .addCase(initCustomLinkCollection.rejected, (state) => {
        state.status = "failed";
        state.errorMessage = "";
      })
      .addCase(initCustomLinkCollection.fulfilled, (state, action) => {
        customLinkCollectionAdapter.setAll(state, action.payload);
        state.status = "idle";
        state.errorMessage = "";
      })
      // init All
      .addCase(initCustomLinkAll.pending, (state) => {
        state.status = "loading";
        state.errorMessage = "";
      })
      .addCase(initCustomLinkAll.rejected, (state) => {
        state.status = "failed";
        state.errorMessage = "";
      })
      .addCase(initCustomLinkAll.fulfilled, (state, action) => {
        customLinkCollectionAdapter.setAll(state, action.payload);
        state.status = "idle";
        state.errorMessage = "";
      })
      // fetch
      .addCase(fetchAllCustomLinkCollection.pending, (state) => {
        state.status = "loading";
        state.errorMessage = "";
      })
      .addCase(fetchAllCustomLinkCollection.rejected, (state) => {
        state.status = "failed";
        state.errorMessage = "";
      })
      .addCase(fetchAllCustomLinkCollection.fulfilled, (state, action) => {
        customLinkCollectionAdapter.setAll(state, action.payload);
        state.status = "idle";
        state.errorMessage = "";
      })
      // addOne
      .addCase(addOneCustomLinkCollection.pending, (state) => {
        state.status = "loading";
        state.errorMessage = "";
      })
      .addCase(addOneCustomLinkCollection.rejected, (state, action) => {
        state.status = "failed";
        state.errorMessage = action.error.message ?? "";
      })
      .addCase(addOneCustomLinkCollection.fulfilled, (state, action) => {
        customLinkCollectionAdapter.addOne(state, action.payload);
        state.status = "idle";
        state.errorMessage = "";
      })
      // updateMany
      .addCase(updateManyCustomLinkCollection.pending, (state) => {
        state.status = "loading";
        state.errorMessage = "";
      })
      .addCase(updateManyCustomLinkCollection.rejected, (state, action) => {
        state.status = "failed";
        state.errorMessage = action.error.message ?? "";
      })
      .addCase(updateManyCustomLinkCollection.fulfilled, (state, action) => {
        customLinkCollectionAdapter.updateMany(state, action.payload);
        state.status = "idle";
        state.errorMessage = "";
      })
      // removeOne
      .addCase(removeOneCustomLinkCollection.pending, (state) => {
        state.status = "loading";
        state.errorMessage = "";
      })
      .addCase(removeOneCustomLinkCollection.rejected, (state) => {
        state.status = "failed";
        state.errorMessage = "";
      })
      .addCase(removeOneCustomLinkCollection.fulfilled, (state, action) => {
        customLinkCollectionAdapter.removeOne(state, action.payload);
        state.status = "idle";
        state.errorMessage = "";
      });
  },
});

export const selectCustomLinkCollection =
  customLinkCollectionAdapter.getSelectors<RootState>(
    (state) => state.customLinkCollection
  );

export default customLinkCollectionSlice.reducer;
