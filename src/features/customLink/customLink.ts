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
        id: list_id,
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
    response.links.forEach((customLink) => {
      customLink.id = `${list_id}/${customLink.id}`;
      customLinksBucket.set({
        [customLink.id]: customLink,
      });
    });
  }
}

export async function getCustomLinks(): Promise<CustomLinksBucket> {
  return await customLinksBucket.get();
}

/**
 * change to include a delimiter before and after `match`
 * example: `nodejs` is not matched to `js`
 */
export function toMatchWithDelimiter(match: string): RegExp {
  return new RegExp("(^|\\s)(" + match + ")(\\s|$)", "i");
}

/**
 * replace for URL-specific search. leave directory.
 * example: to distinguish "developer.mozilla.org/ja" and "developer.mozilla.org/en-US"
 */
export function toGoogleWithUrl(url: string, keyword: string): string {
  const parent = url
    .replace(/^https?:\/\//, "")
    .replace(/[^/]*\.(html|php)$/, "");
  return `https://www.google.com/search?q=site:${parent} ${keyword}`;
}
