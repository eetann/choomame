import {
  customLinkListBucket,
  customLinkListOnInstalled,
  customLinksBucket,
  fetchCustomLinkUrl,
} from "./customLink";
import { CustomLinkListBucket, customLinkUrlSchema } from "./customLinkSchema";
import { addManyCustomLinks, removeManyCustomLinks } from "./customLinkSlice";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const initCustomLinkList = createAsyncThunk<CustomLinkListBucket>(
  "customLinkList/initCustomLinkList",
  async () => {
    await customLinkListBucket.clear();
    customLinkListOnInstalled();
    return await customLinkListBucket.get();
  }
);

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
    const customLinkList: CustomLinkListBucket = {
      [list_id]: {
        name: response.name,
        url: customLinkUrl,
      },
    };
    customLinkListBucket.set(customLinkList);
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

const initialState = {
  list: {} as CustomLinkListBucket,
  status: "idle",
  errorMessage: "",
};

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
        state.list = action.payload;
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
        state.list = action.payload;
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
        const list_id = Object.keys(action.payload)[0];
        state.list[list_id] = action.payload[list_id];
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
        delete state.list[action.payload];
        state.status = "idle";
        state.errorMessage = "";
      });
  },
});

export default customLinkListSlice.reducer;
