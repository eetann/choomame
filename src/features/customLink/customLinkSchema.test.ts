import {
  CustomLink,
  customLinkSchema,
  customLinkListIdSchema,
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
  const defaultCustomLink = {
    id: "abc",
    name: "abc",
    url: "https://www.google.com/search",
    match: "javascript|js",
    group: "abc",
    enable: false,
  };
  test.each<TestCase>([
    {
      title: "custom link id is 1 character",
      customLink: Object.assign({}, defaultCustomLink, { id: "a" }),
    },
    {
      title: "custom link id is 50 characters",
      customLink: Object.assign({}, defaultCustomLink, {
        id: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      }),
    },
    {
      title: "custom link name is 1 character",
      customLink: Object.assign({}, defaultCustomLink, { name: "a" }),
    },
    {
      title: "custom link name is 50 characters",
      customLink: Object.assign({}, defaultCustomLink, {
        name: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      }),
    },
    {
      title: "custom link URL is 200 characters",
      customLink: Object.assign({}, defaultCustomLink, {
        url: "https://www.google.com/search?q=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      }),
    },
    {
      title: "custom link match is 1 character",
      customLink: Object.assign({}, defaultCustomLink, { match: "a" }),
    },
    {
      title: "custom link match is 100 characters",
      customLink: Object.assign({}, defaultCustomLink, {
        match:
          "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      }),
    },
    {
      title: "custom link match is valid RegExp",
      customLink: Object.assign({}, defaultCustomLink, {
        match: "javascript|js",
      }),
    },
    {
      title: "custom link group name is 1 character",
      customLink: Object.assign({}, defaultCustomLink, { group: "a" }),
    },
    {
      title: "custom link group name is 50 characters",
      customLink: Object.assign({}, defaultCustomLink, {
        group: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      }),
    },
  ])("[normal] %s", ({ customLink }) => {
    expect(customLinkSchema.parse(customLink)).toEqual(customLink);
  });

  test.each<TestCase>([
    {
      title: "custom link id is empty",
      customLink: Object.assign({}, defaultCustomLink, { id: "" }),
      expected: "custom link id must be between 1 and 50 characters.",
    },
    {
      title: "custom link id is more than 50 characters(51 characters)",
      customLink: Object.assign({}, defaultCustomLink, {
        id: "baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      }),
      expected: "custom link id must be between 1 and 50 characters.",
    },
    {
      title: "custom link name is empty",
      customLink: Object.assign({}, defaultCustomLink, { name: "" }),
      expected: "custom link name must be between 1 and 50 characters.",
    },
    {
      title: "custom link name is more than 50 characters(51 characters)",
      customLink: Object.assign({}, defaultCustomLink, {
        name: "baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      }),
      expected: "custom link name must be between 1 and 50 characters.",
    },
    {
      title: "custom link url is more than 200 characters(201 characters)",
      customLink: Object.assign({}, defaultCustomLink, {
        url: "https://www.google.com/search?q=baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      }),
      expected: "URL should not exceed 200 characters.",
    },
    {
      title: "custom link url is not a valid URL format",
      customLink: Object.assign({}, defaultCustomLink, { url: "Kerry" }),
      expected: "URL is invalid.",
    },
    {
      title: "custom link url is not a valid URL format",
      customLink: Object.assign({}, defaultCustomLink, { url: "" }),
      expected: "URL is invalid.",
    },
    {
      title: "custom link match is invalid RegExp",
      customLink: Object.assign({}, defaultCustomLink, {
        match: "+javascript|js",
      }),
    },
    {
      title: "custom link match is empty",
      customLink: Object.assign({}, defaultCustomLink, { match: "" }),
      expected: "custom link match must be between 1 and 100 characters.",
    },
    {
      title: "custom link match is more than 100 characters(101 characters)",
      customLink: Object.assign({}, defaultCustomLink, {
        match:
          "baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      }),
      expected: "custom link match must be between 1 and 100 characters.",
    },
    {
      title: "custom link group is empty",
      customLink: Object.assign({}, defaultCustomLink, { group: "" }),
      expected: "custom link group name must be between 1 and 50 characters.",
    },
    {
      title: "custom link group is more than 50 characters(51 characters)",
      customLink: Object.assign({}, defaultCustomLink, {
        group: "baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      }),
      expected: "custom link group name must be between 1 and 50 characters.",
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
        "https://www.google.com/search?q=baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
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
