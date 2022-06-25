import { createSlice } from "@reduxjs/toolkit";

export type Param = {
  url: string;
  q: string; // query
  tbs: string; // time
  lr: string; // language
  tbm: string; // search target
};

export function generateParam(url: URL): Param {
  return {
    url: url.toString(),
    q: url.searchParams.get("q") || "",
    tbs: url.searchParams.get("tbs") || "",
    lr: url.searchParams.get("lr") || "",
    tbm: url.searchParams.get("tbm") || "",
  };
}

export const paramSlice = createSlice({
  name: "param",
  initialState: {} as Param,
  reducers: {
    setParam(state) {
      const url = new URL(location.href);
      const param = generateParam(url);
      return { ...state, ...param };
    },
  },
});

export const { setParam } = paramSlice.actions;

export default paramSlice.reducer;
