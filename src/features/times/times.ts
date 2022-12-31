import {
  convertTimesToBucket,
  initialTimesStorage,
  TimesBucket,
} from "./timesSchema";
import { getBucket } from "@extend-chrome/storage";

export const timesBucket = getBucket<TimesBucket>("times");

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
