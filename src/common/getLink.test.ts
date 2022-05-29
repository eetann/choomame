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
    {
      title: "query includes !",
      // sometimes searches from the address bar do not escape to %21
      param: {
        url: "https://www.google.com/search?q=kerry%21eurodyne",
        q: "kerry!eurodyne",
        tbs: "",
        lr: "",
        tbm: "",
      },
      expected: "https://www.google.com/search?q=kerry%21eurodyne",
    },
    {
      title: 'query includes "',
      // sometimes searches from the address bar do not escape to %22
      param: {
        url: "https://www.google.com/search?q=kerry%22eurodyne",
        q: 'kerry"eurodyne',
        tbs: "",
        lr: "",
        tbm: "",
      },
      expected: "https://www.google.com/search?q=kerry%22eurodyne",
    },
    {
      title: "query includes #",
      param: {
        url: "https://www.google.com/search?q=kerry%23eurodyne",
        q: "kerry#eurodyne",
        tbs: "",
        lr: "",
        tbm: "",
      },
      expected: "https://www.google.com/search?q=kerry%23eurodyne",
    },
    {
      title: "query includes $",
      param: {
        url: "https://www.google.com/search?q=kerry%24eurodyne",
        q: "kerry$eurodyne",
        tbs: "",
        lr: "",
        tbm: "",
      },
      expected: "https://www.google.com/search?q=kerry%24eurodyne",
    },
    {
      title: "query includes %",
      param: {
        url: "https://www.google.com/search?q=kerry%25eurodyne",
        q: "kerry%eurodyne",
        tbs: "",
        lr: "",
        tbm: "",
      },
      expected: "https://www.google.com/search?q=kerry%25eurodyne",
    },
    {
      title: "query includes &",
      param: {
        url: "https://www.google.com/search?q=kerry%26eurodyne",
        q: "kerry&eurodyne",
        tbs: "",
        lr: "",
        tbm: "",
      },
      expected: "https://www.google.com/search?q=kerry%26eurodyne",
    },
    {
      title: "query includes '",
      param: {
        url: "https://www.google.com/search?q=kerry%27eurodyne",
        q: "kerry'eurodyne",
        tbs: "",
        lr: "",
        tbm: "",
      },
      expected: "https://www.google.com/search?q=kerry%27eurodyne",
    },
    {
      title: "query includes (",
      // sometimes searches from the address bar do not escape to %28
      param: {
        url: "https://www.google.com/search?q=kerry%28eurodyne",
        q: "kerry(eurodyne",
        tbs: "",
        lr: "",
        tbm: "",
      },
      expected: "https://www.google.com/search?q=kerry%28eurodyne",
    },
    {
      title: "query includes )",
      // sometimes searches from the address bar do not escape to %29
      param: {
        url: "https://www.google.com/search?q=kerry%29eurodyne",
        q: "kerry)eurodyne",
        tbs: "",
        lr: "",
        tbm: "",
      },
      expected: "https://www.google.com/search?q=kerry%29eurodyne",
    },
    {
      title: "query includes *",
      param: {
        url: "https://www.google.com/search?q=kerry*eurodyne",
        q: "kerry*eurodyne",
        tbs: "",
        lr: "",
        tbm: "",
      },
      expected: "https://www.google.com/search?q=kerry*eurodyne",
    },
    {
      title: "query includes +",
      param: {
        url: "https://www.google.com/search?q=kerry%2Beurodyne",
        q: "kerry+eurodyne",
        tbs: "",
        lr: "",
        tbm: "",
      },
      expected: "https://www.google.com/search?q=kerry%2Beurodyne",
    },
    {
      title: "query includes ,",
      param: {
        url: "https://www.google.com/search?q=kerry%2Ceurodyne",
        q: "kerry,eurodyne",
        tbs: "",
        lr: "",
        tbm: "",
      },
      expected: "https://www.google.com/search?q=kerry%2Ceurodyne",
    },
    {
      title: "query includes /",
      param: {
        url: "https://www.google.com/search?q=kerry%2Feurodyne",
        q: "kerry/eurodyne",
        tbs: "",
        lr: "",
        tbm: "",
      },
      expected: "https://www.google.com/search?q=kerry%2Feurodyne",
    },
    {
      title: "query includes :",
      param: {
        url: "https://www.google.com/search?q=kerry%3Aeurodyne",
        q: "kerry:eurodyne",
        tbs: "",
        lr: "",
        tbm: "",
      },
      expected: "https://www.google.com/search?q=kerry%3Aeurodyne",
    },
    {
      title: "query includes ;",
      param: {
        url: "https://www.google.com/search?q=kerry%3Beurodyne",
        q: "kerry;eurodyne",
        tbs: "",
        lr: "",
        tbm: "",
      },
      expected: "https://www.google.com/search?q=kerry%3Beurodyne",
    },
    {
      title: "query includes <",
      param: {
        url: "https://www.google.com/search?q=kerry%3Ceurodyne",
        q: "kerry<eurodyne",
        tbs: "",
        lr: "",
        tbm: "",
      },
      expected: "https://www.google.com/search?q=kerry%3Ceurodyne",
    },
    {
      title: "query includes =",
      param: {
        url: "https://www.google.com/search?q=kerry%3Deurodyne",
        q: "kerry=eurodyne",
        tbs: "",
        lr: "",
        tbm: "",
      },
      expected: "https://www.google.com/search?q=kerry%3Deurodyne",
    },
    {
      title: "query includes >",
      param: {
        url: "https://www.google.com/search?q=kerry%3Eeurodyne",
        q: "kerry>eurodyne",
        tbs: "",
        lr: "",
        tbm: "",
      },
      expected: "https://www.google.com/search?q=kerry%3Eeurodyne",
    },
    {
      title: "query includes ?",
      param: {
        url: "https://www.google.com/search?q=kerry%3Feurodyne",
        q: "kerry?eurodyne",
        tbs: "",
        lr: "",
        tbm: "",
      },
      expected: "https://www.google.com/search?q=kerry%3Feurodyne",
    },
    {
      title: "query includes @",
      param: {
        url: "https://www.google.com/search?q=kerry%40eurodyne",
        q: "kerry@eurodyne",
        tbs: "",
        lr: "",
        tbm: "",
      },
      expected: "https://www.google.com/search?q=kerry%40eurodyne",
    },
    {
      title: "query includes [",
      param: {
        url: "https://www.google.com/search?q=kerry%5Beurodyne",
        q: "kerry[eurodyne",
        tbs: "",
        lr: "",
        tbm: "",
      },
      expected: "https://www.google.com/search?q=kerry%5Beurodyne",
    },
    {
      title: "query includes ]",
      param: {
        url: "https://www.google.com/search?q=kerry%5Deurodyne",
        q: "kerry]eurodyne",
        tbs: "",
        lr: "",
        tbm: "",
      },
      expected: "https://www.google.com/search?q=kerry%5Deurodyne",
    },
    {
      title: "query includes ^",
      param: {
        url: "https://www.google.com/search?q=kerry%5Eeurodyne",
        q: "kerry^eurodyne",
        tbs: "",
        lr: "",
        tbm: "",
      },
      expected: "https://www.google.com/search?q=kerry%5Eeurodyne",
    },
    {
      title: "query includes _",
      // %5F
      param: {
        url: "https://www.google.com/search?q=kerry_eurodyne",
        q: "kerry_eurodyne",
        tbs: "",
        lr: "",
        tbm: "",
      },
      expected: "https://www.google.com/search?q=kerry_eurodyne",
    },
    {
      title: "query includes `",
      param: {
        url: "https://www.google.com/search?q=kerry%60eurodyne",
        q: "kerry`eurodyne",
        tbs: "",
        lr: "",
        tbm: "",
      },
      expected: "https://www.google.com/search?q=kerry%60eurodyne",
    },
    {
      title: "query includes {",
      param: {
        url: "https://www.google.com/search?q=kerry%7Beurodyne",
        q: "kerry{eurodyne",
        tbs: "",
        lr: "",
        tbm: "",
      },
      expected: "https://www.google.com/search?q=kerry%7Beurodyne",
    },
    {
      title: "query includes |",
      param: {
        url: "https://www.google.com/search?q=kerry%7Ceurodyne",
        q: "kerry|eurodyne",
        tbs: "",
        lr: "",
        tbm: "",
      },
      expected: "https://www.google.com/search?q=kerry%7Ceurodyne",
    },
    {
      title: "query includes }",
      param: {
        url: "https://www.google.com/search?q=kerry%7Deurodyne",
        q: "kerry}eurodyne",
        tbs: "",
        lr: "",
        tbm: "",
      },
      expected: "https://www.google.com/search?q=kerry%7Deurodyne",
    },
    {
      title: "query includes ~",
      // sometimes searches from the address bar do not escape to %7E
      param: {
        url: "https://www.google.com/search?q=kerry%7Eeurodyne",
        q: "kerry~eurodyne",
        tbs: "",
        lr: "",
        tbm: "",
      },
      expected: "https://www.google.com/search?q=kerry%7Eeurodyne",
    },
  ])("%s", ({ param, expected }) => {
    expect(param.q).toBe(new URL(param.url).searchParams.get("q"));
    expect(getLink(param)).toBe(expected);
  });
});
