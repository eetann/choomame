import { z } from "zod";

function messageStringMinMax(variable: string, min: number, max: number) {
  return z
    .string()
    .refine((value: string) => min <= value.length && value.length <= max, {
      message: `${variable} must be between ${min} and ${max} characters.`,
    });
}

const customLinkItemIdSchema = messageStringMinMax("custom link id", 1, 50);

export const customLinkItemSchema = z.object({
  id: customLinkItemIdSchema,
  name: messageStringMinMax("custom link name", 1, 50),
  url: z
    .string()
    .url({ message: "URL is invalid." })
    .max(200, { message: "URL should not exceed 200 characters." }),
  match: messageStringMinMax("custom link match", 1, 100).refine(
    (value: string) => {
      try {
        new RegExp(value);
      } catch (e) {
        return false;
      }
      return true;
    },
    (value: string) => ({
      message: `'${value}' is not a valid regular expression`,
    })
  ),
  group: messageStringMinMax("custom link group name", 1, 50),
  enable: z.boolean().default(true),
});

export type CustomLinkItem = z.infer<typeof customLinkItemSchema>;
export const customLinkItemWithoutIdSchema = customLinkItemSchema.omit({
  id: true,
});
export type CustomLinkItemWithoutId = z.infer<
  typeof customLinkItemWithoutIdSchema
>;

export const customLinkItemListSchema = z.array(customLinkItemSchema);

export type CustomLinkItemList = z.infer<typeof customLinkItemListSchema>;

export type CustomLinkItemBucket = Record<string, CustomLinkItem>;

export const customLinkCollectionIdSchema = messageStringMinMax(
  "Collection id",
  1,
  50
);

export const customLinkUrlSchema = z
  .string()
  .url({ message: "Collection URL is invalid." })
  .max(150, { message: "Collection URL is less than or equal to letter 150" });

export const customLinkCollectionSchema = z.object({
  id: customLinkCollectionIdSchema,
  name: messageStringMinMax("Collection name", 1, 50),
  url: customLinkUrlSchema,
});

export type CustomLinkCollection = z.infer<typeof customLinkCollectionSchema>;

export type CustomLinkCollectionBucket = Record<string, CustomLinkCollection>;

export const customLinkFetchJsonSchema = z.object({
  id: customLinkCollectionIdSchema,
  name: messageStringMinMax("Collection name", 1, 50),
  items: customLinkItemListSchema,
});

export type CustomLinkFetchJson = z.infer<typeof customLinkFetchJsonSchema>;

const customLinkCollectionRestoreSchema = z.array(
  z.object({
    url: customLinkUrlSchema,
    disableIds: z.array(customLinkItemIdSchema),
  })
);

export type CustomLinkCollectionRestore = z.infer<
  typeof customLinkCollectionRestoreSchema
>;

export const customLinkRestoreJsonSchema = z.object({
  id: customLinkCollectionIdSchema,
  name: messageStringMinMax("collection name", 1, 50),
  items: customLinkItemListSchema,
  collection: customLinkCollectionRestoreSchema,
});

export type CustomLinkRestoreJson = z.infer<typeof customLinkRestoreJsonSchema>;

export let initialCustomLinkUrls = [
  "https://raw.githubusercontent.com/eetann/choomame-custom-link-collection/main/src/developer.json5",
  "https://raw.githubusercontent.com/eetann/choomame-custom-link-collection/main/src/aws.json5",
  "https://raw.githubusercontent.com/eetann/choomame-custom-link-collection/main/src/google-cloud.json5",
];
if (import.meta.env && import.meta.env.VITE_E2E) {
  initialCustomLinkUrls = [
    "https://raw.githubusercontent.com/eetann/choomame-custom-link-collection/main/src/choomame-e2e.json5",
  ];
}

export type DiffCustomLinkItemList = {
  sameIds: Set<string>;
  beforeOnlyIds: string[];
  afterOnlyBucket: CustomLinkItemBucket;
};

export function diffCustomLinkItemList(
  before: CustomLinkItemBucket,
  after: CustomLinkItemBucket
): DiffCustomLinkItemList {
  const afterIdSet = new Set(Object.keys(after));
  const beforeIds = Object.keys(before);
  const sameIds = new Set(
    beforeIds.filter((beforeId) => afterIdSet.has(beforeId))
  );
  const afterOnlyBucket: CustomLinkItemBucket = {};
  afterIdSet.forEach((id) => {
    if (!sameIds.has(id)) {
      afterOnlyBucket[id] = after[id];
    }
  });

  return {
    sameIds,
    beforeOnlyIds: beforeIds.filter((id) => !sameIds.has(id)),
    afterOnlyBucket,
  };
}
