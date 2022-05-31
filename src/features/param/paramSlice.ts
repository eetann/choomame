import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Param = {
  url: string;
  q: string; // query
  tbs: string; // time
  lr: string; // language
  tbm: string; // search target
};

export function getParam() {}

export const paramSlice = createSlice({
  name: "param",
  initialState: {} as Param,
  reducers: {
    setParam: {
      reducer(state, action: PayloadAction<URL>) {
        const url = action.payload;
        state.url = url.toString();
        state.q = url.searchParams.get("q") || "";
        state.tbs = url.searchParams.get("tbs") || "";
        state.lr = url.searchParams.get("lr") || "";
        state.tbm = url.searchParams.get("tbm") || "";
      },
      prepare() {
        return {
          payload: new URL(location.href),
        };
      },
    },
  },
});

export const { setParam } = paramSlice.actions;

export default paramSlice.reducer;
