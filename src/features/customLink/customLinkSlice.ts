import { RootState } from "../../app/store";
import { customLinksBucket, customLinksOnInstalled } from "./customLink";
import {
  CustomLink,
  CustomLinks,
  CustomLinksBucket,
  CustomLinkWithoutId,
  diffCustomLinks,
} from "./customLinkSchema";
import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  nanoid,
} from "@reduxjs/toolkit";

export const initCustomLinks = createAsyncThunk<CustomLinksBucket>(
  "customLinks/initCustomLinks",
  async () => {
    await customLinksBucket.clear();
    await customLinksOnInstalled();
    return await customLinksBucket.get();
  }
);

const customLinksAdapter = createEntityAdapter<CustomLink>({
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

export const fetchAllCustomLinks = createAsyncThunk<CustomLinksBucket>(
  "customLinks/fetchAllCustomLinks",
  async () => {
    return await customLinksBucket.get();
  }
);

export const toggleOneCustomLink = createAsyncThunk(
  "customLinks/toggleOneCustomLink",
  async (args: CustomLink) => {
    const customLink: CustomLink = { ...args, enable: !args.enable };
    customLinksBucket.set({ [customLink.id]: customLink });
    return customLink;
  }
);

export const addOneCustomLink = createAsyncThunk(
  "customLinks/addOneCustomLink",
  async (item: CustomLinkWithoutId) => {
    const list_id = "user";
    const id = `${list_id}/${nanoid()}`;
    const customLink = { id, ...item };
    customLinksBucket.set({ [id]: customLink });
    return customLink;
  }
);

export const addManyCustomLinks = createAsyncThunk(
  "customLinks/addManyCustomLinks",
  async (args: { items: CustomLink[]; list_id: string }) => {
    const customLinks = {} as CustomLinksBucket;
    for (const item of args.items) {
      item.id = `${args.list_id}/${item.id}`;
      customLinks[item.id] = item;
    }
    customLinksBucket.set(customLinks);
    return customLinks;
  }
);

export const removeManyCustomLinks = createAsyncThunk(
  "customLink/removdeManyCustomLinks",
  async (customLinkIds: string[]) => {
    customLinksBucket.remove(customLinkIds);
    return customLinkIds;
  }
);

export const updateManyCustomLinks = createAsyncThunk(
  "customLinks/updateManyCustomLinks",
  async (
    args: {
      beforeCustomLinkBucket: CustomLinksBucket;
      updateItems: CustomLink[];
      list_id: string;
    },
    { dispatch }
  ) => {
    let updates: CustomLinks = [];

    // diff
    const afterCustomLinkBucket: CustomLinksBucket = {};
    args.updateItems.forEach((customLink) => {
      const id = `${args.list_id}/${customLink.id}`;
      afterCustomLinkBucket[id] = { ...customLink, id };
    });

    const { sameIds, beforeOnlyIds, afterOnlyBucket } = diffCustomLinks(
      args.beforeCustomLinkBucket,
      afterCustomLinkBucket
    );

    // update existing
    for (const item_id of sameIds) {
      const customLink = {
        ...afterCustomLinkBucket[item_id],
        enable: args.beforeCustomLinkBucket[item_id].enable,
      };
      await customLinksBucket.set({ [customLink.id]: customLink });
      updates.push(customLink);
    }

    // add afterOnly
    await customLinksBucket.set(afterOnlyBucket);
    updates = updates.concat(Object.values(afterOnlyBucket));

    // delete beforeOnly
    await dispatch(removeManyCustomLinks(beforeOnlyIds));

    return updates;
  }
);

const initialState = customLinksAdapter.getInitialState({
  status: "idle",
});

export const customLinkSlice = createSlice({
  name: "customLinks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // init
      .addCase(initCustomLinks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(initCustomLinks.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(initCustomLinks.fulfilled, (state, action) => {
        customLinksAdapter.setAll(state, action.payload);
        state.status = "idle";
      })
      // fetch
      .addCase(fetchAllCustomLinks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllCustomLinks.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(fetchAllCustomLinks.fulfilled, (state, action) => {
        customLinksAdapter.setAll(state, action.payload);
        state.status = "idle";
      })
      // toggle enable
      .addCase(toggleOneCustomLink.pending, (state) => {
        state.status = "loading";
      })
      .addCase(toggleOneCustomLink.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(toggleOneCustomLink.fulfilled, (state, action) => {
        customLinksAdapter.updateOne(state, {
          id: action.payload.id,
          changes: action.payload,
        });
        state.status = "idle";
      })
      // addOne
      .addCase(addOneCustomLink.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addOneCustomLink.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(addOneCustomLink.fulfilled, (state, action) => {
        customLinksAdapter.addOne(state, action.payload);
        state.status = "idle";
      })
      // addMany
      .addCase(addManyCustomLinks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addManyCustomLinks.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(addManyCustomLinks.fulfilled, (state, action) => {
        customLinksAdapter.addMany(state, action.payload);
        state.status = "idle";
      })
      // updateMany
      .addCase(updateManyCustomLinks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateManyCustomLinks.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(updateManyCustomLinks.fulfilled, (state, action) => {
        customLinksAdapter.upsertMany(state, action.payload);
        state.status = "idle";
      })
      // removeMany
      .addCase(removeManyCustomLinks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeManyCustomLinks.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(removeManyCustomLinks.fulfilled, (state, action) => {
        customLinksAdapter.removeMany(state, action.payload);
        state.status = "idle";
      });
  },
});

export const selectCustomLinks = customLinksAdapter.getSelectors<RootState>(
  (state) => state.customLinks
);

export default customLinkSlice.reducer;
