import { RootState } from "../../app/store";
import {
  customLinkListBucket,
  customLinkListOnInstalled,
  customLinksBucket,
  fetchCustomLinkUrl,
  updateCustomLinkList,
  updateCustomLinks,
} from "./customLink";
import {
  CustomLinkList,
  CustomLinkListBucket,
  CustomLinks,
  CustomLinksBucket,
  customLinkUrlSchema,
} from "./customLinkSchema";
import {
  addManyCustomLinks,
  initCustomLinks,
  removeManyCustomLinks,
  updateManyCustomLinks,
} from "./customLinkSlice";
import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  Update,
} from "@reduxjs/toolkit";

export const initCustomLinkList = createAsyncThunk<CustomLinkListBucket>(
  "customLinkList/initCustomLinkList",
  async () => {
    await customLinkListBucket.clear();
    customLinkListOnInstalled();
    return await customLinkListBucket.get();
  }
);

export const initCustomLinkAll = createAsyncThunk<CustomLinkListBucket>(
  "customLinkList/initCustomLinkAll",
  async (_, { dispatch }) => {
    await customLinkListBucket.clear();
    await customLinkListOnInstalled();
    await dispatch(initCustomLinks());
    return await customLinkListBucket.get();
  }
);

const customLinkListAdapter = createEntityAdapter<CustomLinkList>({
  selectId: (item) => item.id,
  sortComparer: (a, b) => {
    if (a.name < b.name) {
      // a, b
      return -1;
    }
    return 1;
  },
});

export const fetchAllCustomLinkList = createAsyncThunk<CustomLinkListBucket>(
  "customLinkList/fetchAllCustomLinkList",
  async () => {
    const bucket = await customLinkListBucket.get();
    return bucket;
  }
);

export const addOneCustomLinkList = createAsyncThunk(
  "customLinkList/addOneCustomLinkList",
  async (arg: string, { dispatch }) => {
    const result = customLinkUrlSchema.safeParse(arg);
    if (!result.success) {
      throw new Error(result.error.issues[0].message);
    }
    const customLinkUrl = result.data;
    const response = await fetchCustomLinkUrl(customLinkUrl);
    const list_id = response.id;
    const customLinkList: CustomLinkList = {
      id: list_id,
      name: response.name,
      url: customLinkUrl,
    };
    customLinkListBucket.set({ [list_id]: customLinkList });
    await dispatch(addManyCustomLinks({ items: response.links, list_id }));
    return customLinkList;
  }
);

export const removeOneCustomLinkList = createAsyncThunk(
  "customLinkList/removeOneCustomLinkList",
  async (list_id: string, { dispatch }) => {
    customLinkListBucket.remove(list_id);
    let customLinkIds = await customLinksBucket.getKeys();
    customLinkIds = customLinkIds.filter((item_id) =>
      item_id.startsWith(list_id)
    );
    await dispatch(removeManyCustomLinks(customLinkIds));
    return list_id;
  }
);

export const updateManyCustomLinkList = createAsyncThunk(
  "customLinkList/updateManyCustomLinkList",
  async (_, { dispatch }): Promise<Update<CustomLinkList>[]> => {
    const updateCustomLinksFunction = async (
      beforeCustomLinkBucket: CustomLinksBucket,
      updateItems: CustomLinks,
      list_id: string
    ) => {
      await dispatch(
        updateManyCustomLinks({
          beforeCustomLinkBucket,
          updateItems,
          list_id,
        })
      );
      return [];
    };
    return await updateCustomLinkList(updateCustomLinksFunction);
  }
);

const initialState = customLinkListAdapter.getInitialState({
  status: "idle",
  errorMessage: "",
});

export const customLinkListSlice = createSlice({
  name: "customLinkList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // init
      .addCase(initCustomLinkList.pending, (state) => {
        state.status = "loading";
        state.errorMessage = "";
      })
      .addCase(initCustomLinkList.rejected, (state) => {
        state.status = "failed";
        state.errorMessage = "";
      })
      .addCase(initCustomLinkList.fulfilled, (state, action) => {
        customLinkListAdapter.setAll(state, action.payload);
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
        customLinkListAdapter.setAll(state, action.payload);
        state.status = "idle";
        state.errorMessage = "";
      })
      // fetch
      .addCase(fetchAllCustomLinkList.pending, (state) => {
        state.status = "loading";
        state.errorMessage = "";
      })
      .addCase(fetchAllCustomLinkList.rejected, (state) => {
        state.status = "failed";
        state.errorMessage = "";
      })
      .addCase(fetchAllCustomLinkList.fulfilled, (state, action) => {
        customLinkListAdapter.setAll(state, action.payload);
        state.status = "idle";
        state.errorMessage = "";
      })
      // addOne
      .addCase(addOneCustomLinkList.pending, (state) => {
        state.status = "loading";
        state.errorMessage = "";
      })
      .addCase(addOneCustomLinkList.rejected, (state, action) => {
        state.status = "failed";
        state.errorMessage = action.error.message ?? "";
      })
      .addCase(addOneCustomLinkList.fulfilled, (state, action) => {
        customLinkListAdapter.addOne(state, action.payload);
        state.status = "idle";
        state.errorMessage = "";
      })
      // updateMany
      .addCase(updateManyCustomLinkList.pending, (state) => {
        state.status = "loading";
        state.errorMessage = "";
      })
      .addCase(updateManyCustomLinkList.rejected, (state, action) => {
        state.status = "failed";
        state.errorMessage = action.error.message ?? "";
      })
      .addCase(updateManyCustomLinkList.fulfilled, (state, action) => {
        customLinkListAdapter.updateMany(state, action.payload);
        state.status = "idle";
        state.errorMessage = "";
      })
      // removeOne
      .addCase(removeOneCustomLinkList.pending, (state) => {
        state.status = "loading";
        state.errorMessage = "";
      })
      .addCase(removeOneCustomLinkList.rejected, (state) => {
        state.status = "failed";
        state.errorMessage = "";
      })
      .addCase(removeOneCustomLinkList.fulfilled, (state, action) => {
        customLinkListAdapter.removeOne(state, action.payload);
        state.status = "idle";
        state.errorMessage = "";
      });
  },
});

export const selectCustomLinkList =
  customLinkListAdapter.getSelectors<RootState>(
    (state) => state.customLinkList
  );

export default customLinkListSlice.reducer;
