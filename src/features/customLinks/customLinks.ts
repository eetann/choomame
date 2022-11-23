import { getBucket } from "@extend-chrome/storage";
import JSON5 from "json5";
import { z } from "zod";

const customLinkSchema = z.object({
  kind: z.string().min(1).max(50),
  url: z.string().url().max(200),
  enable: z.boolean(),
});

const customLinkListIdSchema = z
  .string()
  .min(1)
  .max(50)
  .regex(/[A-Za-z0-9_]/);

const customLinkItemSchema = z.object({
  list_id: customLinkListIdSchema,
  target: z.string().min(1).max(50),
  hit: z.string().refine(
    (value: string) => {
      try {
        new RegExp(value);
      } catch (e) {
        return false;
      }
      return true;
    },
    (value: string) => ({
      message: `${value} is not not a valid regular expression`,
    })
  ),
  links: z.array(customLinkSchema),
});

const customLinkItemsSchema = z.record(customLinkItemSchema);

type CustomLinkItems = z.infer<typeof customLinkItemsSchema>;

const customLinkListSchema = z.record(
  z.object({
    name: z.string().min(1).max(50),
    url: z.string().url().max(150),
  })
);

type CustomLinkList = z.infer<typeof customLinkListSchema>;

export type CustomLinkItemsBucket = {
  list: CustomLinkList;
  items: CustomLinkItems;
};

const fetchCustomLinkUrlSchema = z.object({
  id: customLinkListIdSchema,
  name: z.string().min(1).max(50),
  items: customLinkItemsSchema,
});

export type FetchCustomLinkUrl = z.infer<typeof fetchCustomLinkUrlSchema>;

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
