import { z } from "zod";

function messageStringMinMax(variable: string, min: number, max: number) {
  return z
    .string()
    .refine((value: string) => min <= value.length && value.length <= max, {
      message: `${variable} must be between ${min} and ${max} characters.`,
    });
}

export const customLinkSchema = z.object({
  id: messageStringMinMax("custom link id", 1, 50),
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

export type CustomLink = z.infer<typeof customLinkSchema>;
export const customLinkWithoutIdSchema = customLinkSchema.omit({ id: true });
export type CustomLinkWithoutId = z.infer<typeof customLinkWithoutIdSchema>;

export const customLinksSchema = z.array(customLinkSchema);

export type CustomLinks = z.infer<typeof customLinksSchema>;

export type CustomLinksBucket = Record<string, CustomLink>;

export const customLinkListIdSchema = messageStringMinMax("list_id", 1, 50);

export const customLinkUrlSchema = z
  .string()
  .url({ message: "list's URL is invalid." })
  .max(150, { message: "list's URL is less than or equal to letter 150" });

export const customLinkListSchema = z.object({
  id: customLinkListIdSchema,
  name: messageStringMinMax("list's name", 1, 50),
  url: customLinkUrlSchema,
});

export type CustomLinkList = z.infer<typeof customLinkListSchema>;

export type CustomLinkListBucket = Record<string, CustomLinkList>;

export const fetchCustomLinkUrlSchema = z.object({
  id: customLinkListIdSchema,
  name: messageStringMinMax("list's name", 1, 50),
  links: customLinksSchema,
});

export type FetchCustomLinkUrl = z.infer<typeof fetchCustomLinkUrlSchema>;

export const initialCustomLinkUrls = [
  "https://raw.githubusercontent.com/eetann/choomame-custom-link-list/main/src/developer.json5",
];

export type DiffCustomLinks = {
  sameIds: Set<string>;
  beforeOnlyIds: string[];
  afterOnlyBucket: CustomLinksBucket;
};

export function diffCustomLinks(
  before: CustomLinksBucket,
  after: CustomLinksBucket
): DiffCustomLinks {
  const afterIdSet = new Set(Object.keys(after));
  const beforeIds = Object.keys(before);
  const sameIds = new Set(
    beforeIds.filter((beforeId) => afterIdSet.has(beforeId))
  );
  const afterOnlyBucket: CustomLinksBucket = {};
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
