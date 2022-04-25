import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const timeSlice = createSlice({
  name: "time",
  initialState: {
    value: "",
  },
  reducers: {
    nowTime: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { nowTime } = timeSlice.actions;

export default timeSlice.reducer;
