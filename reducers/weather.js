import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    temp: null,
    clouds: null,
    clartePercent: null,
  },
};

export const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    setWeather: (state, action) => {
      state.value.temp = action.payload.temp;
      state.value.clouds = action.payload.clouds;
      state.value.clartePercent = action.payload.clartePercent;
    },
    clearWeather: (state) => {
      state.value.temp = null;
      state.value.clouds = null;
      state.value.clartePercent = null;
    },
  },
});

export const { setWeather, clearWeather } = weatherSlice.actions;
export default weatherSlice.reducer;
