import {
  CustomLink,
  CustomLinkItem,
  customLinkItemSchema,
  customLinkListIdSchema,
  customLinkSchema,
  customLinkUrlSchema,
  initialCustomLinkUrls,
} from "./customLinkSchema";
import { describe, expect, test } from "vitest";

describe("customLinkSchema test", () => {
  type TestCase = {
    title: string;
    customLink: CustomLink;
    expected?: string;
  };
  test.each<TestCase>([
    {
      title: "`kind` is 1 character",
      customLink: {
        kind: "a",
        url: "https://www.google.com/search",
        enable: false,
      },
    },
    {
      title: "`kind` is 50 characters",
      customLink: {
        kind: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        url: "https://www.google.com/search",
        enable: false,
      },
    },
    {
      title: "`url` is 200 characters",
      customLink: {
        kind: "Document",
        url: "https://www.google.com/search?q=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        enable: false,
      },
    },
  ])("[normal] %s", ({ customLink }) => {
    expect(customLinkSchema.parse(customLink)).toEqual(customLink);
  });

  test.each<TestCase>([
    {
      title: "`kind` is empty",
      customLink: {
        kind: "",
        url: "https://www.google.com/search",
        enable: false,
      },
      expected: "kind must be between 1 and 50 characters.",
    },
    {
      title: "`kind` is more than 50 characters(51 characters)",
      customLink: {
        kind: "baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        url: "https://www.google.com/search",
        enable: false,
      },
      expected: "kind must be between 1 and 50 characters.",
    },
    {
      title: "`url` is not a valid URL format",
      customLink: {
        kind: "Document",
        url: "Kerry",
        enable: false,
      },
      expected: "URL is invalid.",
    },
    {
      title: "`url` is empty",
      customLink: {
        kind: "Document",
        url: "",
        enable: false,
      },
      expected: "URL is invalid.",
    },
    {
      title: "`url` is more than 200 characters(201 characters)",
      customLink: {
        kind: "Document",
        url: "https://www.google.com/search?q=baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        enable: false,
      },
      expected: "URL should not exceed 200 characters.",
    },
  ])("[exception] %s", ({ customLink, expected }) => {
    expect(() => customLinkSchema.parse(customLink)).toThrowError(expected);
  });
});

describe("customLinkListIdSchema test", () => {
  type TestCase = {
    title: string;
    customLinkListId: string;
    expected?: string;
  };
  test.each<TestCase>([
    {
      title: "`customLinkListId` is 1 character",
      customLinkListId: "a",
    },
    {
      title: "`customLinkListId` is 50 characters",
      customLinkListId: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    },
  ])("[normal] %s", ({ customLinkListId }) => {
    expect(() =>
      customLinkListIdSchema.parse(customLinkListId)
    ).not.toThrowError();
  });
  test.each<TestCase>([
    {
      title: "`customLinkListId` is empty",
      customLinkListId: "",
      expected: "list_id must be between 1 and 50 characters.",
    },
    {
      title: "`customLinkListId` is more than 50 characters(51 characters)",
      customLinkListId: "baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      expected: "list_id must be between 1 and 50 characters.",
    },
  ])("[exception] %s", ({ customLinkListId, expected }) => {
    expect(() => customLinkListIdSchema.parse(customLinkListId)).toThrowError(
      expected
    );
  });
});

describe("customLinkItem test", () => {
  type TestCase = {
    title: string;
    customLinkItem: CustomLinkItem;
    expected?: string;
  };
  const customLink: CustomLink = {
    kind: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    url: "https://www.google.com/search",
    enable: false,
  };
  test.each<TestCase>([
    {
      title: "`id` is 1 character",
      customLinkItem: {
        id: "a",
        list_id: "a",
        target: "a",
        hit: "javascript|js",
        links: [customLink],
      },
    },
    {
      title: "`id` is 50 character",
      customLinkItem: {
        id: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        list_id: "a",
        target: "a",
        hit: "javascript|js",
        links: [customLink],
      },
    },
    {
      title: "`target` is 1 character",
      customLinkItem: {
        id: "a",
        list_id: "a",
        target: "a",
        hit: "javascript|js",
        links: [customLink],
      },
    },
    {
      title: "`target` is 50 character",
      customLinkItem: {
        id: "a",
        list_id: "a",
        target: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        hit: "javascript|js",
        links: [customLink],
      },
    },
    {
      title: "`hit` is valid RegExp",
      customLinkItem: {
        id: "a",
        list_id: "a",
        target: "JavaScript",
        hit: "javascript|js",
        links: [customLink],
      },
    },
  ])("[normal] %s", ({ customLinkItem }) => {
    expect(() => customLinkItemSchema.parse(customLinkItem)).not.toThrowError();
  });
  test.each<TestCase>([
    {
      title: "`id` is empty",
      customLinkItem: {
        id: "",
        list_id: "a",
        target: "a",
        hit: "javascript|js",
        links: [customLink],
      },
      expected: "item's id must be between 1 and 50 characters.",
    },
    {
      title: "`id` is more than 50 characters(51 characters)",
      customLinkItem: {
        id: "baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        list_id: "a",
        target: "a",
        hit: "javascript|js",
        links: [customLink],
      },
      expected: "item's id must be between 1 and 50 characters.",
    },
    {
      title: "`target` is empty",
      customLinkItem: {
        id: "a",
        list_id: "a",
        target: "",
        hit: "javascript|js",
        links: [customLink],
      },
      expected: "target must be between 1 and 50 characters.",
    },
    {
      title: "`target` is more than 50 characters(51 characters)",
      customLinkItem: {
        id: "a",
        list_id: "a",
        target: "baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        hit: "javascript|js",
        links: [customLink],
      },
      expected: "target must be between 1 and 50 characters.",
    },
    {
      title: "`hit` is invalid RegExp",
      customLinkItem: {
        id: "a",
        list_id: "a",
        target: "JavaScript",
        hit: "+javascript|js",
        links: [customLink],
      },
      expected: "'+javascript|js' is not a valid regular expression",
    },
  ])("[normal] %s", ({ customLinkItem, expected }) => {
    expect(() => customLinkItemSchema.parse(customLinkItem)).toThrowError(
      expected
    );
  });
});

describe("customLinkUrl test", () => {
  type TestCase = {
    title: string;
    customLinkUrl: string;
    expected?: string;
  };

  test.each<TestCase>([
    {
      title: "list's URL is 150 character",
      customLinkUrl:
        "https://www.google.com/search?q=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    },
  ])("[normal] %s", ({ customLinkUrl }) => {
    expect(() => customLinkUrlSchema.parse(customLinkUrl)).not.toThrowError();
  });

  test.each<TestCase>([
    {
      title: "list's id is more than 150 characters(151 characters)",
      customLinkUrl:
        "https://www.google.com/search?q=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab",
      expected: "list's URL is less than or equal to letter 150",
    },
    {
      title: "list's URL is invalid.",
      customLinkUrl: "Kerry",
      expected: "list's URL is invalid.",
    },
  ])("[normal] %s", ({ customLinkUrl, expected }) => {
    expect(() => customLinkUrlSchema.parse(customLinkUrl)).toThrowError(
      expected
    );
  });

  test.each<string>(initialCustomLinkUrls)("[normal] %s", (url) => {
    expect(() => customLinkUrlSchema.parse(url)).not.toThrowError();
  });
});
