import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    token: null,
    username: null,
    location: null,
    equipement: null,
    avatar: null,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.token = action.payload.token;
      state.value.username = action.payload.username;
      state.value.equipement = action.payload.equipement;
      state.value.avatar = action.payload.avatar;
      console.log("reducer user login/signup", action.payload);
    },
    logout: state => {
      state.value.token = null;
      state.value.username = null;
      state.value.location = null;
      state.value.avatar = null;
    },
    updateLocation: (state, action) => {
      state.value.location = action.payload;
    },
    updateEquipement: (state, action) => {
      state.value.equipement = action.payload;
    },
    addPhoto: (state, action) => {
      state.value.avatar = action.payload;
    },
  },
});

export const { login, logout, updateLocation, updateEquipement, addPhoto } =
  userSlice.actions;
export default userSlice.reducer;
