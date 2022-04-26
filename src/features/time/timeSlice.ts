import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

// 便利そうなので createEntityAdapter 使ってみる

type Time = {
  timeId: string; // w1
  unit: string; // a, y, m, w...
  number: Number; // 1
};

const timeUnitOrder: { [index: string]: Number } = {
  a: 0, // all
  y: 1, // year
  m: 2, // month
  w: 3, // week
  d: 4, // day
  h: 5, // hour
  n: 6, // minute
};

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

export const timeSlice = createSlice({
  name: "time",
  initialState: timesAdapter.getInitialState(),
  reducers: {
    timeAddOne: timesAdapter.addOne,
    timeAddMany: timesAdapter.addMany,
    timeRemoved: timesAdapter.removeOne,
  },
});

export const { timeAddOne, timeAddMany, timeRemoved } = timeSlice.actions;

export default timeSlice.reducer;
