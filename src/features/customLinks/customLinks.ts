import {
  CustomLinkItems,
  CustomLinkItemsBucket,
  CustomLinkList,
  FetchCustomLinkUrl,
  fetchCustomLinkUrlSchema,
  initialCustomLinkUrls,
} from "./customLinksSchema";
import { getBucket } from "@extend-chrome/storage";
import JSON5 from "json5";

export const customLinkBucket = getBucket<CustomLinkItemsBucket>("customLink");

export const initialCustomLinkList: CustomLinkList = {};
export const initialCustomLinkItems: CustomLinkItems = {};

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
  const customLinkList : CustomLinkList = {}
  const customLinkItems: CustomLinkItems = {}
  if (Object.keys(listBucket).length === 0) {
    for (const customLinkUrl of initialCustomLinkUrls) {
      let response;

      try {
        response = await fetchCustomLinkUrl(customLinkUrl);
      } catch (e) {
        console.log(e);
        continue;
      }
      const list_id = response.id;

      customLinkList[list_id] = {
            name: response.name,
            url: customLinkUrl,
          }
      for (const [id, item] of Object.entries(response.items)) {
        customLinkItems[id] = {...item, list_id}
      }
    }
    customLinkBucket.set({ list: customLinkList, items: customLinkItems });
  }
}
