import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
    setParam: {
      reducer(state, action: PayloadAction<URL>) {
        const url = action.payload;
        const param = generateParam(url);
        return { ...state, ...param };
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
