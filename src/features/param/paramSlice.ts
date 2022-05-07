import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Param = {
  url: string;
  q: string; // query
  tbs: string; // time
  lr: string; // language
  tbm: string; // search target
  qLink?: string; // encoded URL
};

const initialState: Param = {
  url: "https://www.google.com/search?q=kerry",
  q: "kerry",
  tbs: "",
  lr: "",
  tbm: "",
  qLink: "https://www.google.com/search?q=kerry",
};

export const paramSlice = createSlice({
  name: "param",
  initialState,
  reducers: {
    setParam: (state, action: PayloadAction<Param>) => {
      state.url = action.payload.url;
      state.q = action.payload.q;
      state.tbs = action.payload.tbs;
      state.lr = action.payload.lr;
      state.tbm = action.payload.tbm;
      state.qLink =
        action.payload.url.replace(/\?.*$/, "") +
        "?q=" +
        encodeURIComponent(action.payload.q);
    },
  },
});

export const { setParam } = paramSlice.actions;

export default paramSlice.reducer;
