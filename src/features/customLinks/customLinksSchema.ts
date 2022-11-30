import { z } from "zod";

function messageStringMinMax(variable: string, min: number, max: number) {
  return z
    .string()
    .refine((value: string) => min <= value.length && value.length <= max, {
      message: `${variable} must be between ${min} and ${max} characters.`,
    });
}

export const customLinkSchema = z.object({
  kind: messageStringMinMax("kind", 1, 50),
  url: z
    .string()
    .url({ message: "URL is invalid." })
    .max(200, { message: "URL should not exceed 200 characters." }),
  enable: z.boolean(),
});

export type CustomLink = z.infer<typeof customLinkSchema>;

export const customLinkListIdSchema = messageStringMinMax("list_id", 1, 50);

export const customLinkItemSchema = z.object({
  list_id: customLinkListIdSchema,
  target: messageStringMinMax("target", 1, 50),
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
      message: `'${value}' is not a valid regular expression`,
    })
  ),
  links: z.array(customLinkSchema),
});

export type CustomLinkItem = z.infer<typeof customLinkItemSchema>;

export const customLinkItemsSchema = z.record(
  messageStringMinMax("item's id", 1, 50),
  customLinkItemSchema
);

export type CustomLinkItems = z.infer<typeof customLinkItemsSchema>;

export const customLinkListSchema = z.record(
  z.object({
    name: z.string().min(1).max(50),
    url: z.string().url().max(150),
  })
);

export type CustomLinkList = z.infer<typeof customLinkListSchema>;

export type CustomLinkItemsBucket = {
  list: CustomLinkList;
  items: CustomLinkItems;
};

export const fetchCustomLinkUrlSchema = z.object({
  id: customLinkListIdSchema,
  name: z.string().min(1).max(50),
  items: customLinkItemsSchema,
});

export type FetchCustomLinkUrl = z.infer<typeof fetchCustomLinkUrlSchema>;
