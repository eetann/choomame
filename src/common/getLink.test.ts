import { expect, test } from 'vitest'
import { Param } from "../features/param/paramSlice";
import { getLink } from "./getLink";

test('make link with parameter', () => {
  const param:Param = {
    url: "https://www.google.com/search?q=kerry",
    q: "kerry",
    tbs: "",
    lr: "",
    tbm: "",
    qLink: "https://www.google.com/search?q=kerry",
  };
  expect(getLink(param)).toBe("https://www.google.com/search?q=kerry");
})
