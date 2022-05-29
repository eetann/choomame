import { Param } from "../features/param/paramSlice";
import { getLink } from "./getLink";
import { describe, expect, test } from "vitest";

describe("generate link", () => {
  test.each([
    {
      title: "only query",
      param: {
        url: "https://www.google.com/search?q=kerry",
        q: "kerry",
        tbs: "",
        lr: "",
        tbm: "",
      },
      expected: "https://www.google.com/search?q=kerry",
    },
    {
      title: "with parameters",
      param: {
        url: "https://www.google.com/search?q=kerry",
        q: "kerry",
        tbs: "qdr:y1",
        lr: "lang_ja",
        tbm: "",
      },
      expected: "https://www.google.com/search?q=kerry&tbs=qdr:y1&lr=lang_ja",
    },
    {
      title: "with tbm",
      param: {
        url: "https://www.google.com/search?q=kerry",
        q: "kerry",
        tbs: "qdr:y1",
        lr: "lang_ja",
        tbm: "isch",
      },
      expected:
        "https://www.google.com/search?q=kerry&tbs=qdr:y1&lr=lang_ja&tbm=isch",
    },
  ])("%s", ({ param, expected }) => {
    expect(param.q).toBe(new URL(param.url).searchParams.get("q"));
    expect(getLink(param)).toBe(expected);
  });
});

describe("escape", () => {
  test.each([
    {
      title: "escape query for tbs",
      param: {
        url: "https://www.google.com/search?q=%26tbs%3Dqdr%253A",
        q: "&tbs=qdr%3A",
        tbs: "",
        lr: "",
        tbm: "",
      },
      expected: "https://www.google.com/search?q=%26tbs%3Dqdr%253A",
    },
    {
      title: "query includes space represented by +",
      param: {
        url: "https://www.google.com/search?q=kerry+eurodyne",
        q: "kerry eurodyne",
        tbs: "",
        lr: "",
        tbm: "",
      },
      expected: "https://www.google.com/search?q=kerry+eurodyne",
    },
    {
      title: "query includes space represented by %20",
      param: {
        url: "https://www.google.com/search?q=kerry%20eurodyne",
        q: "kerry eurodyne",
        tbs: "",
        lr: "",
        tbm: "",
      },
      expected: "https://www.google.com/search?q=kerry+eurodyne",
    },
  ])("%s", ({ param, expected }) => {
    expect(param.q).toBe(new URL(param.url).searchParams.get("q"));
    expect(getLink(param)).toBe(expected);
  });

  // {
  //   title: 'query includes "',
  //   param: {
  //     url: "https://www.google.com/search?q=kerry%22eurodyne",
  //     q: 'kerry"eurodyne',
  //     tbs: "",
  //     lr: "",
  //     tbm: "",
  //   },
  //   expected: "https://www.google.com/search?q=kerry%22eurodyne",
  // },
  test.each([
    ["!", "%21"],
    ['"', "%22"], // sometimes searches from the address bar do not escape to %22
    ["#", "%23"],
    ["$", "%24"],
    ["%", "%25"],
    ["&", "%26"],
    ["'", "%27"],
    ["(", "%28"], // sometimes searches from the address bar do not escape to %28
    [")", "%29"], // sometimes searches from the address bar do not escape to %29
    ["*", "*"],
    ["+", "%2B"],
    [",", "%2C"],
    ["/", "%2F"],
    [":", "%3A"],
    [";", "%3B"],
    ["<", "%3C"],
    ["=", "%3D"],
    [">", "%3E"],
    ["?", "%3F"],
    ["@", "%40"],
    ["[", "%5B"],
    ["]", "%5D"],
    ["^", "%5E"],
    ["_", "_"],
    ["`", "%60"],
    ["{", "%7B"],
    ["~", "%7E"], // sometimes searches from the address bar do not escape to %7E
  ])("query includes %s", (str, esc) => {
    const expected = "https://www.google.com/search?q=kerry" + esc + "eurodyne";
    const param: Param = {
      url: `https://www.google.com/search?q=kerry${esc}eurodyne`,
      q: `kerry${str}eurodyne`,
      tbs: "",
      lr: "",
      tbm: "",
    };
    expect(param.q).toBe(new URL(param.url).searchParams.get("q"));
    expect(getLink(param)).toBe(expected);
  });
});
