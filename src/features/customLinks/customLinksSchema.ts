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

export const customLinkListIdSchema = z
  .string()
  .min(1)
  .max(50)
  .regex(/[A-Za-z0-9_]/);

export const customLinkItemSchema = z.object({
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

export const customLinkItemsSchema = z.record(customLinkItemSchema);

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
