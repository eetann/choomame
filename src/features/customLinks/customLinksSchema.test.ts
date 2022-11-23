import { CustomLink, customLinkSchema } from "./customLinksSchema";
import { describe, expect, test } from "vitest";

type TestCase = {
  title: string;
  customLink: CustomLink;
};

describe("validation check", () => {
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
      title: "`kind` is 50 character",
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
    },
    {
      title: "`kind` is more than 50 characters(51 characters)",
      customLink: {
        kind: "baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        url: "https://www.google.com/search",
        enable: false,
      },
    },
    {
      title: "`url` is more than 200 characters(201 characters)",
      customLink: {
        kind: "Document",
        url: "https://www.google.com/search?q=baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        enable: false,
      },
    },
    {
      title: "`url` is empty",
      customLink: {
        kind: "Document",
        url: "",
        enable: false,
      },
    },
    {
      title: "`url` is not a valid URL format",
      customLink: {
        kind: "Document",
        url: "Kerry",
        enable: false,
      },
    },
  ])("[exception] %s", ({ customLink }) => {
    expect(() => customLinkSchema.parse(customLink)).toThrow();
  });
});
