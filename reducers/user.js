import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    token: null,
    username: null,
    location: null,
    equipement: null,
    avatar: null,
    xp: null,
    hasLoaded: false,
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
      state.value.xp = action.payload.xp;
      state.value.avatar = action.payload.avatar;
    },
    logout: (state) => {
      state.value.token = null;
      state.value.username = null;
      state.value.location = null;
      state.value.avatar = null;
      state.value.hasLoaded = false; // reset au logout
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
    updateXP: (state, action) => {
      state.value.xp = action.payload;
    },
    setHasLoaded: (state) => {
      state.value.hasLoaded = true;
    },
  },
});

export const {
  login,
  logout,
  updateLocation,
  updateEquipement,
  addPhoto,
  updateXP,
  setHasLoaded,
} = userSlice.actions;

export default userSlice.reducer;