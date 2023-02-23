import {
  convertTimesToBucket,
  initialTimesStorage,
  Time,
  TimesBucket,
  timeUnitOrder,
} from "./timesSchema";
import { getBucket } from "@extend-chrome/storage";

export const timesBucket = getBucket<TimesBucket>("times");

export async function timesOnInstalled() {
  const bucket = await timesBucket.get();
  if (Object.keys(bucket).length === 0) {
    timesBucket.set(convertTimesToBucket(initialTimesStorage));
  }
}

export function sortTimes(a: Time, b: Time) {
  const aUnit = timeUnitOrder[a.unit];
  const bUnit = timeUnitOrder[b.unit];
  if (aUnit < bUnit) {
    // a, b
    return -1;
  } else if (aUnit > bUnit) {
    // b, a
    return 1;
  }
  if (a.number > b.number) {
    // a, b
    return -1;
  }
  // b, a
  return 1;
}

export async function getTimes(): Promise<TimesBucket> {
  const bucket = await timesBucket.get();
  return bucket;
}
