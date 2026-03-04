import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const astreSlice = createSlice({
  name: "astre",
  initialState,
  reducers: {
    AddAstres: (state, action) => {
      state.value.push(action.payload);
    },
  },
});

export const { AddAstres } = astreSlice.actions;
export default astreSlice.reducer;
