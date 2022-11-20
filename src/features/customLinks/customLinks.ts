import { getBucket } from "@extend-chrome/storage";
import JSON5 from "json5";
import { RiTyphoonFill } from "react-icons/ri";

export type CustomLink = {
  kind: string;
  url: string;
  enable: boolean;
};

export type CustomLinkItem = {
  list_id: string;
  target: string;
  hit: string;
  links: CustomLink[];
};

export type CustomLinkItems = Record<string, CustomLinkItem>;

export type CustomLinkListInfo = {
  name: string;
  url: string;
};

export type CustomLinkList = Record<string, CustomLinkListInfo>;

export type CustomLinkItemsBucket = {
  list: CustomLinkList;
  items: CustomLinkItems;
};

export type FetchCustomLinkUrl = {
  id: string;
  name: string;
} & { items: CustomLinkItems };

export const customLinkBucket = getBucket<CustomLinkItemsBucket>("customLink");

export const initialCustomLinkList: CustomLinkList = {};
export const initialCustomLinkItems: CustomLinkItems = {};

export const initialCustomLinkUrls = [
  "https://raw.githubusercontent.com/eetann/choomame-custom-link-list/main/src/developer.json5",
];

export async function fetchCustomLinkUrl(
  url: string
): Promise<FetchCustomLinkUrl | null> {
  let response = {};
  try {
    response = JSON5.parse<FetchCustomLinkUrl>(await (await fetch(url)).text());
  } catch (e) {
    console.warn(`fetch failed: ${url}`);
    return null;
  }
  // ここでスキーマチェック
  return null;
}

export async function customLinkOnInstalled() {
  const listBucket = await customLinkBucket.get("list");
  if (Object.keys(listBucket).length === 0) {
    for (const customLinkUrl of initialCustomLinkUrls) {
      const response = await fetchCustomLinkUrl(customLinkUrl);
      if (response != null) {
        // TODO: チェックの関数を入れる
        customLinkBucket.set({
          list: {
            [response.id]: {
              name: response.name,
              url: customLinkUrl,
            },
          },
          items: response.items,
        });
      }
    }
    customLinkBucket.set({ list: {}, items: {} });
  }
}
