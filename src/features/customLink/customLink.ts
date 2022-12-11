import {
  CustomLinkItemsBucket,
  CustomLinkListBucket,
  FetchCustomLinkUrl,
  fetchCustomLinkUrlSchema,
  initialCustomLinkUrls,
} from "./customLinkSchema";
import { getBucket } from "@extend-chrome/storage";
import JSON5 from "json5";

export const customLinkListBucket =
  getBucket<CustomLinkListBucket>("customLinkList");
export const customLinkItemsBucket =
  getBucket<CustomLinkItemsBucket>("customLinkItems");

export const initialCustomLinkList: CustomLinkListBucket = {};
export const initialCustomLinkItems: CustomLinkItemsBucket = {};

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
  const listBucket = await customLinkListBucket.get();
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

      customLinkListBucket.set({
        [list_id]: {
          name: response.name,
          url: customLinkUrl,
        },
      });

      for (const [id, item] of Object.entries(response.items)) {
        customLinkItemsBucket.set({
          [id]: { ...item, list_id },
        });
      }
    }
  }
}
