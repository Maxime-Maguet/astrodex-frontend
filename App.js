import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider } from "react-redux";
// import { PersistGate } from 'redux-persist/integration/react';
import ObservationScreen from "./screens/ObservationScreen"; 
import LoginScreen from "./screens/LoginScreen";           
import { configureStore } from "@reduxjs/toolkit";
import user from "./reducers/user";
import SignupScreen from "./screens/signupScreen";
// import {
//   persistStore,
//   persistReducer,
//   FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER,
// } from "redux-persist";
// import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const store = configureStore({
  reducer: { user },
});

function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Observation" component={ObservationScreen} />
    
    </Tab.Navigator>
  );
}


function Navigation() {
  const userToken = useSelector((state) => state.user.value.token);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!userToken ? (
        
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
         
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
          
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Inscription" component={SignupScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}