import {
  CustomLink,
  CustomLinkItem,
  customLinkItemSchema,
  customLinkListIdSchema,
  customLinkSchema,
} from "./customLinksSchema";
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
    {
      title: "In `customLinkListId`, we can use numbers and underscore",
      customLinkListId: "0123456789_-",
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
    {
      title: "`customLinkListId` has invalid characer",
      customLinkListId: "0123456789_-^",
      expected:
        "Only A to Z, a to z, 0 to 9, hyphens and underscores are allowed.",
    },
  ])("[exception] %s", ({ customLinkListId, expected }) => {
    expect(() => customLinkListIdSchema.parse(customLinkListId)).toThrowError(
      expected
    );
  });
});

describe("CustomLinkItems test", () => {
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
      title: "`target` is 1 character",
      customLinkItem: {
        list_id: "a",
        target: "a",
        hit: "javascript|js",
        links: [customLink],
      },
    },
    {
      title: "`target` is 50 character",
      customLinkItem: {
        list_id: "a",
        target: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        hit: "javascript|js",
        links: [customLink],
      },
    },
    {
      title: "`hit` is valid RegExp",
      customLinkItem: {
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
      title: "`target` is empty",
      customLinkItem: {
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
