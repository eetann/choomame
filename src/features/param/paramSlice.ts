import { createSlice } from "@reduxjs/toolkit";

export type ParamTbs = Record<string, string>;

export type Param = {
  url: string;
  q: string; // query
  tbs: ParamTbs; // time
  lr: string; // language
  tbm: string; // search target
};

export type SearchParam = string | null;

export function parseTbs(searchParam: SearchParam): ParamTbs {
  if (!searchParam) {
    return {};
  }
  // searchParam = "key1:value1,key2:value2,key3:value3,..."
  const keyValueMap: ParamTbs = {};
  for (const keyValue of searchParam.split(",")) {
    // keyValue = "key1:value1"
    const keyValueArr: string[] = keyValue.split(":");
    if (keyValueArr.length !== 2) {
      continue;
    }
    keyValueMap[keyValueArr[0]] = keyValueArr[1];
  }
  return keyValueMap;
}

export function joinTbs(paramTbs: ParamTbs): string {
  return Object.entries(paramTbs)
    .map((keyValue) => keyValue.join(":"))
    .join(",");
}

export function generateParam(url: URL): Param {
  return {
    url: url.toString(),
    q: url.searchParams.get("q") || "",
    tbs: parseTbs(url.searchParams.get("tbs")),
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
