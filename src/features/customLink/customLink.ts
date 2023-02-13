import { useDownloader } from "../../common/useDownloader";
import {
  CustomLinkItemBucket,
  CustomLinkCollectionBucket,
  CustomLinkFetchJson,
  customLinkFetchJsonSchema,
  initialCustomLinkUrls,
  CustomLinkItemList,
  diffCustomLinkItemList,
  CustomLinkRestoreJson,
  CustomLinkCollectionRestore,
  customLinkRestoreJsonSchema,
} from "./customLinkSchema";
import { getBucket } from "@extend-chrome/storage";
import JSON5 from "json5";

export const customLinkCollectionBucket = getBucket<CustomLinkCollectionBucket>(
  "customLinkCollection"
);
export const customLinkItemBucket =
  getBucket<CustomLinkItemBucket>("customLinkItem");

export const initialCustomCollection: CustomLinkCollectionBucket = {};

export const isBackgroundUpdatingBucket = getBucket<{ customLink: boolean }>(
  "customLinkIsUpdating"
);
export const alarmBackgroundUpdateCustomLink = "ChoomameCustomLinkUpdate";
export async function setStartBackgroundUpdateCustomLink() {
  await isBackgroundUpdatingBucket.set({ customLink: true });
}

export async function setStopBackgroundUpdateCustomLink() {
  await isBackgroundUpdatingBucket.set({ customLink: false });
}

export async function isBackgroundUpdatingCustomLink() {
  const bucket = await isBackgroundUpdatingBucket.get();
  return bucket.customLink;
}

function parseCustomLinkFetchJson(
  customLinkJson5String: string
): CustomLinkFetchJson {
  let response;
  try {
    response = JSON5.parse<CustomLinkFetchJson>(customLinkJson5String);
  } catch (e) {
    throw new Error("The JSON5 in this URL is an invalid format.");
  }
  const result = customLinkFetchJsonSchema.safeParse(response);
  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }
  return result.data;
}

export async function fetchCustomLinkUrl(
  url: string
): Promise<CustomLinkFetchJson> {
  let response;
  try {
    response = await (await fetch(url, { cache: "no-store" })).text();
  } catch (e) {
    throw new Error(`fetch failed: ${url}`);
  }
  return parseCustomLinkFetchJson(response);
}

export async function customLinkCollectionOnInstalled() {
  const keys = await customLinkCollectionBucket.getKeys();
  // End if Collection already exists.
  if (keys.length !== 0) {
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
    const collectionId = response.id;

    customLinkCollectionBucket.set({
      [collectionId]: {
        id: collectionId,
        name: response.name,
        url: customLinkUrl,
      },
    });
  }
}

export async function customLinkItemOnInstalled() {
  const collectionBucket = await customLinkCollectionBucket.get();
  // End if Collection does not exist
  if (Object.keys(collectionBucket).length === 0) {
    return;
  }
  for (const collectionId in collectionBucket) {
    let response;
    try {
      response = await fetchCustomLinkUrl(collectionBucket[collectionId].url);
    } catch (e) {
      console.log(e);
      continue;
    }
    response.items.forEach((customLink) => {
      customLink.id = `${collectionId}/${customLink.id}`;
      customLinkItemBucket.set({
        [customLink.id]: customLink,
      });
    });
  }
}

export async function updateCustomLinks(
  beforeCustomLinkItemBucket: CustomLinkItemBucket,
  updateItems: CustomLinkItemList,
  collectionId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deleteFunction: (beforeOnlyIds: string[]) => Promise<any>
): Promise<CustomLinkItemList> {
  let updates: CustomLinkItemList = [];

  // diff
  const afterCustomLinkItemBucket: CustomLinkItemBucket = {};
  updateItems.forEach((customLink) => {
    const id = `${collectionId}/${customLink.id}`;
    afterCustomLinkItemBucket[id] = { ...customLink, id };
  });

  const { sameIds, beforeOnlyIds, afterOnlyBucket } = diffCustomLinkItemList(
    beforeCustomLinkItemBucket,
    afterCustomLinkItemBucket
  );

  // update existing
  for (const item_id of sameIds) {
    const customLink = {
      ...afterCustomLinkItemBucket[item_id],
      enable: beforeCustomLinkItemBucket[item_id].enable,
    };
    await customLinkItemBucket.set({ [customLink.id]: customLink });
    updates.push(customLink);
  }

  // add afterOnly
  await customLinkItemBucket.set(afterOnlyBucket);
  updates = updates.concat(Object.values(afterOnlyBucket));

  // delete beforeOnly
  await deleteFunction(beforeOnlyIds);

  return updates;
}

export async function updateCustomLinkCollection(
  updateCustomLinksFunction: (
    beforeCustomLinkBucket: CustomLinkItemBucket,
    updateItems: CustomLinkItemList,
    collectionId: string
  ) => ReturnType<typeof updateCustomLinks>
) {
  const bucket = await customLinkCollectionBucket.get();
  const customLinkBucket = await customLinkItemBucket.get();
  return await Promise.all(
    Object.values(bucket).map(async (customLinkCollection) => {
      const response = await fetchCustomLinkUrl(customLinkCollection.url);
      const collectionId = response.id;
      const beforeCustomLinkBucket: CustomLinkItemBucket = {};
      Object.entries(customLinkBucket).forEach(([id, customLink]) => {
        if (id.startsWith(collectionId)) {
          beforeCustomLinkBucket[id] = customLink;
        }
      });
      await updateCustomLinksFunction(
        beforeCustomLinkBucket,
        response.items,
        collectionId
      );
      const newCollection = {
        id: collectionId,
        name: response.name,
        url: customLinkCollection.url,
      };
      customLinkCollectionBucket.set({ [collectionId]: newCollection });
      return {
        id: collectionId,
        changes: newCollection,
      };
    })
  );
}

export async function updateCustomLinkCollectionOnAlarm() {
  const updateCustomLinksFunction = async (
    beforeCustomLinkBucket: CustomLinkItemBucket,
    updateItems: CustomLinkItemList,
    collectionId: string
  ) => {
    const deleteFunction = async (beforeOnlyIds: string[]) => {
      await customLinkItemBucket.remove(beforeOnlyIds);
    };
    await updateCustomLinks(
      beforeCustomLinkBucket,
      updateItems,
      collectionId,
      deleteFunction
    );
    return [];
  };
  await updateCustomLinkCollection(updateCustomLinksFunction);
}

async function getUserCustomLinks(): Promise<CustomLinkItemList> {
  const keys = await customLinkItemBucket.getKeys();
  const userKeys = keys.filter((key) => key.startsWith("user/"));
  const userCustomLinksBucket = await customLinkItemBucket.get(userKeys);
  return Object.values(userCustomLinksBucket as CustomLinkItemBucket);
}

function selectDisableIds(
  collectionId: string,
  customLinks: CustomLinkItemBucket
) {
  return Object.values(customLinks).flatMap((link) => {
    if (link.id.startsWith(collectionId) && !link.enable) {
      return link.id;
    }
    return [];
  });
}

async function getCustomLinkCollectionBackup(): Promise<CustomLinkCollectionRestore> {
  const collectionBucket = await customLinkCollectionBucket.get();
  const itemBucket = await customLinkItemBucket.get();
  return await Promise.all(
    Object.values(collectionBucket).map((collection) => {
      const collectionId = collection.id;
      const disableIds = selectDisableIds(collectionId, itemBucket);
      return { url: collection.url, disableIds };
    })
  );
}

function customLinksToJson5(
  customLinkItemList: CustomLinkItemList,
  customLinkCollectionRestore: CustomLinkCollectionRestore
): string {
  const customLinkJson: CustomLinkRestoreJson = {
    id: "user",
    name: "user",
    items: customLinkItemList,
    collection: customLinkCollectionRestore,
  };
  return JSON5.stringify(customLinkJson, { space: 2 });
}

export function useExportUserCustomLinks() {
  const download = useDownloader();
  const exportUserCustomLinks = async () => {
    const filename = "choomame-custom-link.json5";

    const customLinks = await getUserCustomLinks();
    const customLinkCollectionBackup = await getCustomLinkCollectionBackup();
    const customLinkJson5String = customLinksToJson5(
      customLinks,
      customLinkCollectionBackup
    );
    const blob = new Blob([customLinkJson5String], {
      type: "plain/text",
    });

    download(blob, filename);
  };
  return exportUserCustomLinks;
}

function parseUserCustomLinks(
  customLinkJson5String: string
): CustomLinkRestoreJson {
  let response;
  try {
    response = JSON5.parse<CustomLinkRestoreJson>(customLinkJson5String);
  } catch (e) {
    throw new Error("The JSON5 in this URL is an invalid format.");
  }
  const result = customLinkRestoreJsonSchema.safeParse(response);
  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }
  return result.data;
}

export async function importUserCustomLink(
  addCustomLinks: (customLinkBackupJson: CustomLinkRestoreJson) => Promise<void>
) {
  const inputFile = document.createElement("input");
  inputFile.type = "file";
  inputFile.accept = ".json5";
  inputFile.onchange = (e) => {
    try {
      const target = e.target as HTMLInputElement;
      if (!target.files || target.files?.length === 0) {
        return;
      }
      const file = target.files[0];
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = async (event) => {
        const content = (event.target?.result as string) ?? "";
        const customLinkJson = parseUserCustomLinks(content);
        await addCustomLinks(customLinkJson);
      };
    } catch (e) {
      return;
    }
  };
  inputFile.click();
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
