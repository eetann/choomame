import type { RootState } from "../../app/store";
import { getBucket } from "@extend-chrome/storage";
import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";

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
type TimesBucket = Record<string, Time>;

const timesBucket = getBucket<TimesBucket>("times");

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
function convertTimesToBucket(times: Time[]): TimesBucket {
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

export const initTimes = createAsyncThunk<TimesBucket>(
  "times/initTimes",
  async () => {
    await timesBucket.clear();
    return await timesBucket.set(convertTimesToBucket(initialTimesStorage));
  }
);

export const fetchAllTimes = createAsyncThunk<TimesBucket>(
  "times/fetchAllTimes",
  async () => {
    return await timesBucket.get();
  }
);

export const addOneTime = createAsyncThunk(
  "times/addOneTime",
  async (arg: { unit: TimesUnit; number: number }) => {
    const time = {
      timeId: getTimeId(arg.unit, arg.number),
      unit: arg.unit,
      number: arg.number,
    };
    timesBucket.set({ [time.timeId]: time });
    return time;
  }
);

export const removeOneTime = createAsyncThunk(
  "times/removeOneTime",
  async (timeId: string) => {
    timesBucket.remove(timeId);
    return timeId;
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
const initialTimesStorage: Time[] = [
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

const timesInitialEntityState = timesAdapter.getInitialState({
  status: "idle",
});

export const timesSlice = createSlice({
  name: "times",
  initialState: timesInitialEntityState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(initTimes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(initTimes.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(initTimes.fulfilled, (state, action) => {
        timesAdapter.setAll(state, action.payload);
        state.status = "idle";
      })
      .addCase(fetchAllTimes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllTimes.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(fetchAllTimes.fulfilled, (state, action) => {
        timesAdapter.setAll(state, action.payload);
        state.status = "idle";
      })
      .addCase(addOneTime.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addOneTime.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(addOneTime.fulfilled, (state, action) => {
        timesAdapter.addOne(state, action.payload);
        state.status = "idle";
      })
      .addCase(removeOneTime.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeOneTime.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(removeOneTime.fulfilled, (state, action) => {
        timesAdapter.removeOne(state, action.payload);
        state.status = "idle";
      });
  },
});

export const selectTimes = timesAdapter.getSelectors<RootState>(
  (state) => state.times
);

export default timesSlice.reducer;
