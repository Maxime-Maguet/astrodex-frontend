import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const astreSlice = createSlice({
  name: "astre",
  initialState,
  reducers: {
    addAstre: (state, action) => {
      const alreadyCaptured = state.value.some(
        (astre) => astre._id === action.payload._id,
      );
      if (!alreadyCaptured) {
        state.value.push(action.payload);
      }
    },
  },
});

export const { addAstre } = astreSlice.actions;
export default astreSlice.reducer;
