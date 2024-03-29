import type { RootState } from "../../app/store";
import { sortTimes, timesBucket } from "./times";
import {
  convertTimesToBucket,
  getTimeId,
  initialTimesStorage,
  Time,
  TimesBucket,
  TimesUnit,
} from "./timesSchema";
import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";

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
    return sortTimes(a, b);
  },
});

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
