import { Param } from "../features/param/paramSlice";
import { getLink } from "./getLink";
import { describe, expect, test } from "vitest";

describe("generate link", () => {
  test("without parameters", () => {
    const param: Param = {
      url: "https://www.google.com/search?q=kerry",
      q: "kerry",
      tbs: "",
      lr: "",
      tbm: "",
      qLink: "https://www.google.com/search?q=kerry",
    };
    expect(getLink(param)).toBe("https://www.google.com/search?q=kerry");
  });

  test("with parameters", () => {
    const param: Param = {
      url: "https://www.google.com/search?q=kerry",
      q: "kerry",
      tbs: "qdr:y1",
      lr: "lang_ja",
      tbm: "",
      qLink: "https://www.google.com/search?q=kerry",
    };
    expect(getLink(param)).toBe(
      "https://www.google.com/search?q=kerry&tbs=qdr:y1&lr=lang_ja"
    );
  });

  test("with tbm parameter", () => {
    const param: Param = {
      url: "https://www.google.com/search?q=kerry",
      q: "kerry",
      tbs: "qdr:y1",
      lr: "lang_ja",
      tbm: "isch",
      qLink: "https://www.google.com/search?q=kerry",
    };
    expect(getLink(param)).toBe(
      "https://www.google.com/search?q=kerry&tbs=qdr:y1&lr=lang_ja&tbm=isch"
    );
  });
});
