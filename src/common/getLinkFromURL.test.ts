import { generateParam } from "../features/param/paramSlice";
import { getLink } from "./getLink";
import { describe, expect, test } from "vitest";
import { Time } from "../features/times/timesSlice";
import { Language } from "../features/languages/languagesSlice";

type TestCase = {
  time?: Time;
  language?: Language;
  expected: string;
}

describe("generate link from URL", () => {
  const timeAny: Time = {
    timeId: "Any",
    unit: "Any",
    number: 0,
  };
  const timeY3: Time = {
    timeId: "y3",
    unit: "year",
    number: 3,
  }
  const timeM1: Time = {
    timeId: "m1",
    unit: "month",
    number: 1,
  }

  test("test 1", () => {
    let url = "https://www.google.com/search?q=kerry";
    const testCases: TestCase[] = [
      {
        time: timeAny,
        language: undefined,
        expected: "https://www.google.com/search?q=kerry",
      },
      {
        time: timeY3,
        language: undefined,
        expected: "https://www.google.com/search?q=kerry&tbs=qdr:y3",
      },
      {
        time: timeM1,
        language: undefined,
        expected: "https://www.google.com/search?q=kerry&tbs=qdr:m1",
      },
      {
        time: undefined,
        language: "Any",
        expected: "https://www.google.com/search?q=kerry&tbs=qdr:m1",
      },
      {
        time: undefined,
        language: "lang_en",
        expected: "https://www.google.com/search?q=kerry&tbs=qdr:m1&lr=lang_en",
      },
      {
        time: timeY3,
        language: undefined,
        expected: "https://www.google.com/search?q=kerry&tbs=qdr:y3&lr=lang_en",
      },
      {
        time: undefined,
        language: "lang_ja",
        expected: "https://www.google.com/search?q=kerry&tbs=qdr:y3&lr=lang_ja",
      },
      {
        time: undefined,
        language: "Any",
        expected: "https://www.google.com/search?q=kerry&tbs=qdr:y3",
      },
      {
        time: timeAny,
        language: undefined,
        expected: "https://www.google.com/search?q=kerry",
      },
    ]
    for (const testCase of testCases) {
      const param = generateParam(new URL(url));
      url = getLink(param, testCase.time, testCase.language);
      expect(url).toEqual(testCase.expected);
    }
  })
})
