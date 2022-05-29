import { createSlice } from "@reduxjs/toolkit";

export type Param = {
  url: string;
  q: string; // query
  tbs: string; // time
  lr: string; // language
  tbm: string; // search target
};

export const paramSlice = createSlice({
  name: "param",
  initialState: {} as Param,
  reducers: {
    setParam: (state) => {
      const url = new URL(location.href);
      state.url = url.toString();
      state.q = url.searchParams.get("q") || "";
      state.tbs = url.searchParams.get("tbs") || "";
      state.lr = url.searchParams.get("lr") || "";
      state.tbm = url.searchParams.get("tbm") || "";
    },
  },
});

export const { setParam } = paramSlice.actions;

export default paramSlice.reducer;
