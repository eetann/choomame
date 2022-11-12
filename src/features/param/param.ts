export type ParamTbs = Record<string, string>;

export type Param = {
  url: string;
  q: string; // query
  tbs: ParamTbs; // time
  lr: string; // language
  tbm: string; // search target
  sidesearch: boolean;
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
    sidesearch: url.searchParams.get("sidesearch") === "1",
  };
}

export const initialParam: Param = {
  url: "",
  q: "",
  tbs: {},
  lr: "",
  tbm: "",
  sidesearch: false,
};

export function getParam(): Param {
  const url = new URL(location.href);
  return generateParam(url);
}
