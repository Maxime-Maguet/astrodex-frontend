import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    token: null,
    username: null,
    location: null,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    //LoginScreen après un fetch réussi
    login: (state, action) => {
      state.value.token = action.payload.token;
      state.value.username = action.payload.username;
    },
    //suppression du token et redirection vers login
    logout: (state) => {
      state.value.token = null;
      state.value.username = null;
      state.value.location = null;
    },
    updateLocation: (state, action) => {
      state.value.location = action.payload;
    },
  },
});

export const { login, logout, updateLocation } = userSlice.actions;
export default userSlice.reducer;
