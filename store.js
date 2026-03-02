import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import user from './reducers/user'; 

const reducers = combineReducers({ user });

// le téléphone se souvient du token
const persistConfig = {
  key: 'AstroDex',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

// création du store
export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);