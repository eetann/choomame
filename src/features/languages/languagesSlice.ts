import { getBucket } from "@extend-chrome/storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const languagesKeyValue = {
  Any: "Any",
  lang_ar: "Arabic",
  lang_bg: "Bulgarian",
  lang_ca: "Catalan",
  "lang_zh-CN": "Chinese (Simplified)",
  "lang_zh-TW": "Chinese (Traditional)",
  lang_hr: "Croatian",
  lang_cs: "Czech",
  lang_da: "Danish",
  lang_nl: "Dutch",
  lang_en: "English",
  lang_et: "Estonian",
  lang_fi: "Finnish",
  lang_fr: "French",
  lang_de: "German",
  lang_el: "Greek",
  lang_iw: "Hebrew",
  lang_hu: "Hungarian",
  lang_is: "Icelandic",
  lang_id: "Indonesian",
  lang_it: "Italian",
  lang_ja: "Japanese",
  lang_ko: "Korean",
  lang_lv: "Latvian",
  lang_lt: "Lithuanian",
  lang_no: "Norwegian",
  lang_pl: "Polish",
  lang_pt: "Portuguese",
  lang_ro: "Romanian",
  lang_ru: "Russian",
  lang_sr: "Serbian",
  lang_sk: "Slovak",
  lang_sl: "Slovenian",
  lang_es: "Spanish",
  lang_sv: "Swedish",
  lang_tr: "Turkish",
};

export type Language = keyof typeof languagesKeyValue;
type LanguagesBucket = Record<"languages", Language[]>;

const languagesBucket = getBucket<LanguagesBucket>("languages");

const initialLanguagesStorage: LanguagesBucket = {
  languages: ["Any", "lang_en", "lang_ja"],
};

export async function languagesOnInstalled() {
  const bucket = await languagesBucket.get();
  if (Object.keys(bucket).length === 0) {
    languagesBucket.set(initialLanguagesStorage);
  }
}

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
