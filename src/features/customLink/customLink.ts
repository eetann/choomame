import {
  CustomLinksBucket,
  CustomLinkListBucket,
  FetchCustomLinkUrl,
  fetchCustomLinkUrlSchema,
  initialCustomLinkUrls,
} from "./customLinkSchema";
import { getBucket } from "@extend-chrome/storage";
import JSON5 from "json5";

export const customLinkListBucket =
  getBucket<CustomLinkListBucket>("customLinkList");
export const customLinksBucket = getBucket<CustomLinksBucket>("customLinks");

export const initialCustomLinkList: CustomLinkListBucket = {};
export const initialCustomLinks: CustomLinksBucket = {};

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
    throw new Error("The JSON5 in this URL is an invalid format.");
  }
  const result = fetchCustomLinkUrlSchema.safeParse(response);
  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }
  return result.data;
}

export async function customLinkListOnInstalled() {
  const listBucket = await customLinkListBucket.get();
  if (Object.keys(listBucket).length !== 0) {
    return;
  }
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
  }
}

export async function customLinksOnInstalled() {
  const listBucket = await customLinkListBucket.get();
  if (Object.keys(listBucket).length === 0) {
    return;
  }
  for (const list_id in listBucket) {
    let response;
    try {
      response = await fetchCustomLinkUrl(listBucket[list_id].url);
    } catch (e) {
      console.log(e);
      continue;
    }
    for (const [id, customLink] of Object.entries(response.links)) {
      customLinksBucket.set({
        [`${list_id}/${id}`]: customLink,
      });
    }
  }
}
