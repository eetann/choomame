import { RootState } from "../../app/store";
import { customLinksBucket, customLinksOnInstalled } from "./customLink";
import {
  CustomLink,
  CustomLinksBucket,
  CustomLinkWithoutId,
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
    customLinksOnInstalled();
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

export const addManyCustomLinks = createAsyncThunk(
  "customLinks/addManyCustomLinks",
  async (args: { items: CustomLinkWithoutId[]; list_id?: string }) => {
    if (typeof args.list_id === "undefined") {
      args.list_id = "user";
    }
    const customLinks = {} as CustomLinksBucket;
    for (const item of args.items) {
      let id = "";
      if (item.id) {
        id = `${args.list_id}/${item.id}`;
      } else {
        id = `${args.list_id}/${nanoid()}`;
      }
      customLinks[id] = { id, ...item };
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
        console.log(100);
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
