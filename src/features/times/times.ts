import { getBucket } from "@extend-chrome/storage";

export type TimesUnit =
  | "Any"
  | "year"
  | "month"
  | "week"
  | "day"
  | "hour"
  | "minute";

export type Time = {
  timeId: string; // w1
  unit: TimesUnit; // Any, year, month, ...
  number: number; // 1
};

/**
 * format to save chrome.storage.local
 * {
 *   w1: {timeId: "w1", unit: "week", number: 1},
 *   y3: {timeId: "y3", unit: "year", number: 3},
 * }
 */
export type TimesBucket = Record<string, Time>;

export const timesBucket = getBucket<TimesBucket>("times");

export const initialTimesStorage: Time[] = [
  {
    timeId: "Any",
    unit: "Any",
    number: 0,
  },
  {
    timeId: "y3",
    unit: "year",
    number: 3,
  },
  {
    timeId: "y1",
    unit: "year",
    number: 1,
  },
  {
    timeId: "m6",
    unit: "month",
    number: 6,
  },
  {
    timeId: "m1",
    unit: "month",
    number: 1,
  },
  {
    timeId: "w1",
    unit: "week",
    number: 1,
  },
  {
    timeId: "d1",
    unit: "day",
    number: 1,
  },
];

export async function timesOnInstalled() {
  const bucket = await timesBucket.get();
  if (Object.keys(bucket).length === 0) {
    timesBucket.set(convertTimesToBucket(initialTimesStorage));
  }
}

export async function getTimes(): Promise<TimesBucket> {
  const bucket = await timesBucket.get();
  return bucket;
}

export function getTimeId(unit: TimesUnit, number: number): string {
  if (unit === "Any") {
    return "Any";
  } else if (unit === "minute") {
    return "n" + number.toString();
  }
  return unit[0] + number.toString();
}

export const timeUnitOrder: Record<TimesUnit, number> = {
  Any: 0, // Any
  year: 1, // year
  month: 2, // month
  week: 3, // week
  day: 4, // day
  hour: 5, // hour
  minute: 6, // minute
};

/**
 * convert Time[] to TimesBucket
 * [
 *   {timeId: "w1", unit: "week", number: 1},
 *   {timeId: "y3", unit: "year", number: 3},
 * ]
 *
 * to
 *
 * {
 *   w1: {timeId: "w1", unit: "week", number: 1},
 *   y3: {timeId: "y3", unit: "year", number: 3},
 * }
 */
export function convertTimesToBucket(times: Time[]): TimesBucket {
  const newObj: TimesBucket = {};
  for (let i = 0, len = times.length; i < len; i++) {
    const time = times[i];
    newObj[time.timeId] = time;
  }
  return newObj;
}

/**
 * convert TimesBucket to Time[]
 * {
 *   w1: {timeId: "w1", unit: "week", number: 1},
 *   y3: {timeId: "y3", unit: "year", number: 3},
 * }
 *
 * to
 *
 * [
 *   {timeId: "w1", unit: "week", number: 1},
 *   {timeId: "y3", unit: "year", number: 3},
 * ]
 */
export function convertBucketToTimes(times: TimesBucket): Time[] {
  return Object.entries(times).map(([_, val]) => val);
}
