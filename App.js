import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Provider } from "react-redux";
// import { PersistGate } from 'redux-persist/integration/react';
import ObservationScreen from "./screens/ObservationScreen";
import LoginScreen from "./screens/LoginScreen";
import { configureStore } from "@reduxjs/toolkit";
import user from "./reducers/user";
import astre from "./reducers/astre";
import SignupScreen from "./screens/signupScreen";
import HomeScreen from "./screens/HomeScreen";
import AstrodexScreen from "./screens/AstrodexScreen";
import EquipementSelectionScreen from "./screens/EquipementSelectionScreen";
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
  reducer: { user, astre },
});

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#5B8CFF",
        tabBarInactiveTintColor: "#121214",
        tabBarStyle: { backgroundColor: "#ffffff" },
        tabBarIcon: ({ color, size }) => {
          let iconName = "";

          if (route.name === "Observation") {
            return <FontAwesome name="binoculars" size={size} color={color} />;
          } else if (route.name === "Astrodex") {
            return <Ionicons name="planet-sharp" size={size} color={color} />;
          }

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Observation" component={ObservationScreen} />
      <Tab.Screen name="Astrodex" component={AstrodexScreen} />
    </Tab.Navigator>
  );
}

//return (
//<NavigationContainer>
//<Stack.Navigator screenOptions={{ headerShown: false }}>

//</Stack.Navigator>
//</NavigationContainer>
//);

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={AstrodexScreen} />
          <Stack.Screen name="Inscription" component={SignupScreen} />
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
