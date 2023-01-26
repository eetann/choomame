import { Language } from "../features/languages/languagesSchema";
import {
  generateParam,
  joinTbs,
  ParamTbs,
  parseTbs,
  SearchParam,
} from "../features/param/param";
import { Time } from "../features/times/timesSchema";
import { getLink } from "./getLink";
import { describe, expect, test } from "vitest";

type TestCaseParseTbs = {
  title: string;
  searchParam: SearchParam;
  expected: ParamTbs;
};

describe("parse tbs for Google search", () => {
  test.each<TestCaseParseTbs>([
    {
      title: "empty string",
      searchParam: "",
      expected: {},
    },
    {
      title: "null",
      searchParam: null,
      expected: {},
    },
    {
      title: "invalid string",
      searchParam: "ILoveKerry",
      expected: {},
    },
    {
      title: "invalid string and valid stirng",
      searchParam: "ILoveKerry,qdr:y3",
      expected: { qdr: "y3" },
    },
    {
      title: "empty string and valid stirng",
      searchParam: ",qdr:y3",
      expected: { qdr: "y3" },
    },
    {
      title: "valid stirng and empty string",
      searchParam: "qdr:y3,",
      expected: { qdr: "y3" },
    },
    {
      title: "valid string and invalid stirng",
      searchParam: "qdr:y3,ILoveKerry",
      expected: { qdr: "y3" },
    },
    {
      title: "valid stirng",
      searchParam: "qdr:y3",
      expected: { qdr: "y3" },
    },
    {
      title: "valid stirngs",
      searchParam: "qdr:y3,hoge:foo",
      expected: { qdr: "y3", hoge: "foo" },
    },
  ])("%s", ({ searchParam, expected }) => {
    expect(parseTbs(searchParam)).toEqual(expected);
  });
});

type TestCaseJoinTbs = {
  title: string;
  tbs: ParamTbs;
  expected: SearchParam;
};

describe("join tbs for Google search", () => {
  test.each<TestCaseJoinTbs>([
    {
      title: "empty string",
      tbs: {},
      expected: "",
    },
    {
      title: "valid stirng",
      tbs: { qdr: "y3" },
      expected: "qdr:y3",
    },
    {
      title: "valid stirngs",
      tbs: { qdr: "y3", hoge: "foo" },
      expected: "qdr:y3,hoge:foo",
    },
  ])("%s", ({ tbs, expected }) => {
    expect(joinTbs(tbs)).toBe(expected);
  });
});

type TestCaseGenerateLink = {
  time?: Time;
  language?: Language;
  expected: string;
};

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
  };
  const timeM1: Time = {
    timeId: "m1",
    unit: "month",
    number: 1,
  };

  test("test 1", () => {
    let url = "https://www.google.com/search?q=kerry";
    const testCases: TestCaseGenerateLink[] = [
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
        expected: "https://www.google.com/search?q=kerry&tbs=qdr:m",
      },
      {
        time: undefined,
        language: "Any",
        expected: "https://www.google.com/search?q=kerry&tbs=qdr:m",
      },
      {
        time: undefined,
        language: "lang_en",
        expected: "https://www.google.com/search?q=kerry&tbs=qdr:m&lr=lang_en",
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
    ];
    for (const testCase of testCases) {
      const param = generateParam(new URL(url));
      url = getLink(param, testCase.time, testCase.language);
      expect(url).toEqual(testCase.expected);
    }
  });

  test("test 2", () => {
    let url = "https://www.google.com/search?q=kerry";
    const testCases: TestCaseGenerateLink[] = [
      {
        time: undefined,
        language: "Any",
        expected: "https://www.google.com/search?q=kerry",
      },
      {
        time: undefined,
        language: "lang_en",
        expected: "https://www.google.com/search?q=kerry&lr=lang_en",
      },
      {
        time: undefined,
        language: "lang_ja",
        expected: "https://www.google.com/search?q=kerry&lr=lang_ja",
      },
      {
        time: timeAny,
        language: undefined,
        expected: "https://www.google.com/search?q=kerry&lr=lang_ja",
      },
      {
        time: timeY3,
        language: undefined,
        expected: "https://www.google.com/search?q=kerry&tbs=qdr:y3&lr=lang_ja",
      },
      {
        time: timeM1,
        language: undefined,
        expected: "https://www.google.com/search?q=kerry&tbs=qdr:m&lr=lang_ja",
      },
      {
        time: undefined,
        language: "lang_en",
        expected: "https://www.google.com/search?q=kerry&tbs=qdr:m&lr=lang_en",
      },
      {
        time: timeAny,
        language: undefined,
        expected: "https://www.google.com/search?q=kerry&lr=lang_en",
      },
      {
        time: undefined,
        language: "Any",
        expected: "https://www.google.com/search?q=kerry",
      },
    ];
    for (const testCase of testCases) {
      const param = generateParam(new URL(url));
      url = getLink(param, testCase.time, testCase.language);
      expect(url).toEqual(testCase.expected);
    }
  });
});
