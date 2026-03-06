import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    token: null,
    username: null,
    location: null,
    equipement: null,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.token = action.payload.token;
      state.value.username = action.payload.username;
      console.log("reducer user login/signup", action.payload);
    },
    logout: (state) => {
      state.value.token = null;
      state.value.username = null;
      state.value.location = null;
    },
    updateLocation: (state, action) => {
      state.value.location = action.payload;
    },
    updateEquipement: (state, action) => {
      state.value.equipement = action.payload;
    },
  },
});

export const { login, logout, updateLocation, updateEquipement } =
  userSlice.actions;
export default userSlice.reducer;
