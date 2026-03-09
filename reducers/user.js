import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    token: null,
    username: null,
    location: null,
    equipement: null,
    avatar: null,
    xp: null,
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
      console.log("xp reducer => ", action.payload.xp);
    },
    logout: (state) => {
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
    updateXP: (state, action) => {
      state.value.xp = action.payload;
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
} = userSlice.actions;
export default userSlice.reducer;
