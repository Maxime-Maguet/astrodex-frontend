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
      console.log("reducer astre =>", action.payload);

      const alreadyCaptured = state.value.some(
        (astre) => astre._id === action.payload._id,
      );
      if (!alreadyCaptured) {
        state.value.push(action.payload);
      }
    },

    setAstreFocus: (state, action) => {
      state.astreFocus = action.payload;
      //console.log("reducer astre =>", action.payload);
    },
  },
});

export const { addAstre, setAstreFocus } = astreSlice.actions;
export default astreSlice.reducer;
