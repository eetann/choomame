import {
  CustomLinkItem,
  customLinkItemSchema,
  customLinkCollectionIdSchema,
  customLinkUrlSchema,
  initialCustomLinkUrls,
  diffCustomLinkItemList,
} from "./customLinkSchema";
import { describe, expect, test } from "vitest";

describe("customLinkSchema test", () => {
  type TestCase = {
    title: string;
    customLink: CustomLinkItem;
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
    expect(customLinkItemSchema.parse(customLink)).toEqual(customLink);
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
    expect(() => customLinkItemSchema.parse(customLink)).toThrowError(expected);
  });
});

describe("customLinkCollectionId test", () => {
  type TestCase = {
    title: string;
    collectionId: string;
    expected?: string;
  };
  test.each<TestCase>([
    {
      title: "`customLinkCollectionId` is 1 character",
      collectionId: "a",
    },
    {
      title: "`customLinkCollectionId` is 50 characters",
      collectionId: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    },
  ])("[normal] %s", ({ collectionId }) => {
    expect(() =>
      customLinkCollectionIdSchema.parse(collectionId)
    ).not.toThrowError();
  });

  test.each<TestCase>([
    {
      title: "`customLinkCollectionId` is empty",
      collectionId: "",
      expected: "Collection id must be between 1 and 50 characters.",
    },
    {
      title:
        "`customLinkCollectionId` is more than 50 characters(51 characters)",
      collectionId: "baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      expected: "Collection id must be between 1 and 50 characters.",
    },
  ])("[exception] %s", ({ collectionId, expected }) => {
    expect(() => customLinkCollectionIdSchema.parse(collectionId)).toThrowError(
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
      title: "Collection URL is 150 character",
      customLinkUrl:
        "https://www.google.com/search?q=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    },
  ])("[normal] %s", ({ customLinkUrl }) => {
    expect(() => customLinkUrlSchema.parse(customLinkUrl)).not.toThrowError();
  });

  test.each<TestCase>([
    {
      title: "Collection URL is more than 150 characters(151 characters)",
      customLinkUrl:
        "https://www.google.com/search?q=baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      expected: "Collection URL is less than or equal to letter 150",
    },
    {
      title: "Collection URL is invalid.",
      customLinkUrl: "Kerry",
      expected: "Collection URL is invalid.",
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

describe("diff customLinks", () => {
  test("[normal]", () => {
    const defaultCL = {
      id: "abc",
      name: "abc",
      url: "https://www.google.com/search",
      match: "javascript|js",
      group: "abc",
      enable: false,
    };
    const before = {
      "target/same": { ...defaultCL, id: "target/same" },
      "target/beforeOnly1": { ...defaultCL, id: "target/beforeOnly1" },
    };
    const after = {
      "target/same": { ...defaultCL, id: "target/same" },
      "target/afterOnly1": { ...defaultCL, id: "target/afterOnly1" },
      "target/afterOnly2": { ...defaultCL, id: "target/afterOnly2" },
    };
    const expected = {
      sameIds: new Set(["target/same"]),
      beforeOnlyIds: ["target/beforeOnly1"],
      afterOnlyBucket: {
        "target/afterOnly1": { ...defaultCL, id: "target/afterOnly1" },
        "target/afterOnly2": { ...defaultCL, id: "target/afterOnly2" },
      },
    };
    expect(diffCustomLinkItemList(before, after)).toEqual(expected);
  });
});
