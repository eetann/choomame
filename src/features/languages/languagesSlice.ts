import { languagesBucket } from "./languages";
import { initialLanguagesStorage, Language } from "./languagesSchema";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const initLanguages = createAsyncThunk<Language[]>(
  "languages/initLanguages",
  async () => {
    await languagesBucket.clear();
    const bucket = await languagesBucket.set(initialLanguagesStorage);
    return bucket.languages;
  }
);

export const fetchLanguages = createAsyncThunk<Language[]>(
  "languages/fetchLanguages",
  async () => {
    const bucket = await languagesBucket.get();
    return bucket.languages;
  }
);

export const addOneLanguage = createAsyncThunk(
  "languages/addOneLanguage",
  async (arg: Language) => {
    const bucket = await languagesBucket.get();
    const languages = bucket.languages;
    languages.push(arg);
    languagesBucket.set({ languages });
    return languages;
  }
);

export const removeOneLanguage = createAsyncThunk(
  "languages/removeOneLanguage",
  async (arg: Language) => {
    const bucket = await languagesBucket.get();
    const languages = bucket.languages.filter((lang) => lang !== arg);
    languagesBucket.set({ languages });
    return languages;
  }
);

const initialState = {
  languages: [] as Language[],
  status: "idle",
};

export const languagesSlice = createSlice({
  name: "languages",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(initLanguages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(initLanguages.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(initLanguages.fulfilled, (state, action) => {
        state.languages = action.payload;
        state.status = "idle";
      })
      .addCase(fetchLanguages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLanguages.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(fetchLanguages.fulfilled, (state, action) => {
        state.languages = action.payload;
        state.status = "idle";
      })
      .addCase(addOneLanguage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addOneLanguage.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(addOneLanguage.fulfilled, (state, action) => {
        state.languages = action.payload;
        state.status = "idle";
      })
      .addCase(removeOneLanguage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeOneLanguage.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(removeOneLanguage.fulfilled, (state, action) => {
        state.languages = action.payload;
        state.status = "idle";
      });
  },
});

export default languagesSlice.reducer;
