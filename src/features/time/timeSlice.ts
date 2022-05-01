import type { RootState } from "../../app/store";
import { getBucket } from "@extend-chrome/storage";
import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";

export type Time = {
  timeId: string; // w1
  unit: string; // all, year, month, ...
  number: Number; // 1
};

/**
 * formant to save chrome.storage.local
 * {
 *   w1: {timeId: "w1", unit: "week", number: 1},
 *   y3: {timeId: "y3", unit: "year", number: 3},
 * }
 */
type TimesBucket = {
  [key: string]: Time;
};

const timesBucket = getBucket<TimesBucket>("times");

const timeUnitOrder: { [index: string]: Number } = {
  all: 0, // all
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
function convertTimesToBucket(times: Time[]): TimesBucket {
  let newObj: TimesBucket = {};
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
function convertBucketToTimes(times: TimesBucket): Time[] {
  return Object.entries(times).map(([_, val]) => val);
}

export function timesOnInstalled() {
  const initialTimesStorage: Time[] = [
    {
      timeId: "all",
      unit: "all",
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
  ];
  timesBucket.set(convertTimesToBucket(initialTimesStorage));
}

export const getAllTimes = createAsyncThunk("times/getAllTimes", async () => {
  const times = await timesBucket.get();
  return convertBucketToTimes(times);
});

export const setAllEntityTimes = createAsyncThunk(
  "times/setAllEntityTimes",
  async (times: Time[]) => {
    timesBucket.set(convertTimesToBucket(times));
  }
);

const timesAdapter = createEntityAdapter<Time>({
  selectId: (time) => time.timeId,
  sortComparer: (a, b) => {
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
  },
});

const timesInitialEntityState = timesAdapter.getInitialState({
  status: "idle",
});

export const timeSlice = createSlice({
  name: "time",
  initialState: timesInitialEntityState,
  reducers: {
    timeAddOne: timesAdapter.addOne,
    timeAddMany: timesAdapter.addMany,
    timeRemoved: timesAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllTimes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllTimes.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(getAllTimes.fulfilled, (state, action) => {
        timesAdapter.setAll(state, action.payload);
        state.status = "idle";
      });
  },
});

export const { timeAddOne, timeAddMany, timeRemoved } = timeSlice.actions;

export const { selectAll: selectAllTimes } =
  timesAdapter.getSelectors<RootState>((state) => state.times);

export default timeSlice.reducer;
