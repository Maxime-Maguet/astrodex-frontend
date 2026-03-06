import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
  astreFocus: null,
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
    setCapturedAstres: (state, action) => {
      state.value = action.payload;
    },

    setAstreFocus: (state, action) => {
      state.astreFocus = action.payload;
    },
  },
});

export const { addAstre, setAstreFocus, setCapturedAstres } =
  astreSlice.actions;
export default astreSlice.reducer;
