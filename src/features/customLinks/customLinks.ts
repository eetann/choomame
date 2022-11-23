import { getBucket } from "@extend-chrome/storage";
import JSON5 from "json5";
import { CustomLinkItems, CustomLinkItemsBucket, CustomLinkList, FetchCustomLinkUrl, fetchCustomLinkUrlSchema } from "./customLinksSchema";

export const customLinkBucket = getBucket<CustomLinkItemsBucket>("customLink");

export const initialCustomLinkList: CustomLinkList = {};
export const initialCustomLinkItems: CustomLinkItems = {};

export const initialCustomLinkUrls = [
  "https://raw.githubusercontent.com/eetann/choomame-custom-link-list/main/src/developer.json5",
];

export async function fetchCustomLinkUrl(
  url: string
): Promise<FetchCustomLinkUrl> {
  let response;
  try {
    response = await (await fetch(url)).text();
  } catch (e) {
    throw new Error(`fetch failed: ${url}`);
  }
  try {
    response = JSON5.parse<FetchCustomLinkUrl>(response);
  } catch (e) {
    throw new Error(`JOSN5 parse Error: ${url}`);
  }
  return fetchCustomLinkUrlSchema.parse(response);
}

export async function customLinkOnInstalled() {
  const listBucket = await customLinkBucket.get("list");
  if (Object.keys(listBucket).length === 0) {
    for (const customLinkUrl of initialCustomLinkUrls) {
      let response;
      try {
        response = await fetchCustomLinkUrl(customLinkUrl);
      } catch (e) {
        console.log(e);
        continue;
      }
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
    customLinkBucket.set({ list: {}, items: {} });
  }
}
