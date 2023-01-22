import {
  CustomLinksBucket,
  CustomLinkListBucket,
  FetchCustomLinkUrl,
  fetchCustomLinkUrlSchema,
  initialCustomLinkUrls,
  CustomLinks,
  diffCustomLinks,
} from "./customLinkSchema";
import { getBucket } from "@extend-chrome/storage";
import JSON5 from "json5";

export const customLinkListBucket =
  getBucket<CustomLinkListBucket>("customLinkList");
export const customLinksBucket = getBucket<CustomLinksBucket>("customLinks");

export const initialCustomLinkList: CustomLinkListBucket = {};
export const initialCustomLinks: CustomLinksBucket = {};

export const customLinkIsUpdatingBucket = getBucket<{ isUpdating: boolean }>(
  "customLinkIsUpdating"
);
export async function setStartUpdatingCustomLink() {
  await customLinkIsUpdatingBucket.set({ isUpdating: true });
}

export async function setStopUpdatingCustomLink() {
  await customLinkIsUpdatingBucket.set({ isUpdating: false });
}

export async function isUpdatingCustomLink() {
  const bucket = await customLinkIsUpdatingBucket.get();
  return bucket.isUpdating;
}

export async function fetchCustomLinkUrl(
  url: string
): Promise<FetchCustomLinkUrl> {
  let response;
  try {
    response = await (await fetch(url, { cache: "no-store" })).text();
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

export async function updateCustomLinks(
  beforeCustomLinkBucket: CustomLinksBucket,
  updateItems: CustomLinks,
  list_id: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deleteFunction: (beforeOnlyIds: string[]) => Promise<any>
): Promise<CustomLinks> {
  let updates: CustomLinks = [];

  // diff
  const afterCustomLinkBucket: CustomLinksBucket = {};
  updateItems.forEach((customLink) => {
    const id = `${list_id}/${customLink.id}`;
    afterCustomLinkBucket[id] = { ...customLink, id };
  });

  const { sameIds, beforeOnlyIds, afterOnlyBucket } = diffCustomLinks(
    beforeCustomLinkBucket,
    afterCustomLinkBucket
  );

  // update existing
  for (const item_id of sameIds) {
    const customLink = {
      ...afterCustomLinkBucket[item_id],
      enable: beforeCustomLinkBucket[item_id].enable,
    };
    await customLinksBucket.set({ [customLink.id]: customLink });
    updates.push(customLink);
  }

  // add afterOnly
  await customLinksBucket.set(afterOnlyBucket);
  updates = updates.concat(Object.values(afterOnlyBucket));

  // delete beforeOnly
  await deleteFunction(beforeOnlyIds);

  return updates;
}

export async function updateCustomLinkList(
  updateCustomLinksFunction: (
    beforeCustomLinkBucket: CustomLinksBucket,
    updateItems: CustomLinks,
    list_id: string
  ) => ReturnType<typeof updateCustomLinks>
) {
  const bucket = await customLinkListBucket.get();
  const customLinkBucket = await customLinksBucket.get();
  return await Promise.all(
    Object.values(bucket).map(async (customLinkList) => {
      const response = await fetchCustomLinkUrl(customLinkList.url);
      const list_id = response.id;
      const beforeCustomLinkBucket: CustomLinksBucket = {};
      Object.entries(customLinkBucket).forEach(([id, customLink]) => {
        if (id.startsWith(list_id)) {
          beforeCustomLinkBucket[id] = customLink;
        }
      });
      await updateCustomLinksFunction(
        beforeCustomLinkBucket,
        response.links,
        list_id
      );
      const newList = {
        id: list_id,
        name: response.name,
        url: customLinkList.url,
      };
      customLinkListBucket.set({ [list_id]: newList });
      return {
        id: list_id,
        changes: newList,
      };
    })
  );
}

export async function updateCustomLinkListonAlarm() {
  const updateCustomLinksFunction = async (
    beforeCustomLinkBucket: CustomLinksBucket,
    updateItems: CustomLinks,
    list_id: string
  ) => {
    const deleteFunction = async (beforeOnlyIds: string[]) => {
      await customLinksBucket.remove(beforeOnlyIds);
    };
    await updateCustomLinks(
      beforeCustomLinkBucket,
      updateItems,
      list_id,
      deleteFunction
    );
    return [];
  };
  await updateCustomLinkList(updateCustomLinksFunction);
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
