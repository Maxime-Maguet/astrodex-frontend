import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Provider } from "react-redux";

import ObservationScreen from "./screens/ObservationScreen";
import LoginScreen from "./screens/LoginScreen";
import user from "./reducers/user";
import astre from "./reducers/astre";
import weather from "./reducers/weather";
import SignupScreen from "./screens/signupScreen";
import HomeScreen from "./screens/HomeScreen";
import AstrodexScreen from "./screens/AstrodexScreen";
import ProfileScreen from "./screens/ProfileScreen";
import EquipementSelectionScreen from "./screens/EquipementSelectionScreen";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";
import * as Updates from "expo-updates";

import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const userPersistConfig = {
  key: "user",
  storage: AsyncStorage,
  whitelist: ["value"],
};

const reducers = combineReducers({
  user: persistReducer(userPersistConfig, user), // ✅ Seul le user est persisté, et seulement les champs utiles

  weather, // ❌ Plus persisté
  astre, // ❌ Plus persisté
});

const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

function TabNavigator() {
  // Cache la barre de navigation Android pour un rendu fullscreen
  useEffect(() => {
    NavigationBar.setVisibilityAsync("hidden");
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#5B8CFF",
        tabBarInactiveTintColor: "#ffffff",

        tabBarBackground: () => (
          <LinearGradient
            colors={["#1D2F49", "#0B0F1A", "#1D2F49"]}
            style={{ flex: 1 }}
          />
        ),
        tabBarStyle: {
          borderTopWidth: 0, // retire le petit trait entre le container et la tab
        },

        tabBarIcon: ({ color, size }) => {
          let iconName = "";

          if (route.name === "Observation") {
            return <FontAwesome name="binoculars" size={size} color={color} />;
          } else if (route.name === "Astrodex") {
            return <Ionicons name="planet-sharp" size={size} color={color} />;
          } else if (route.name === "Acceuil") {
            return <Ionicons name="home" size={size} color={color} />;
          } else if (route.name === "Profil") {
            return (
              <FontAwesome name="user-circle-o" size={size} color={color} />
            );
          }
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Acceuil" component={HomeScreen} />
      <Tab.Screen name="Observation" component={ObservationScreen} />
      <Tab.Screen name="Astrodex" component={AstrodexScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    async function applyUpdate() {
      if (__DEV__) return;
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (error) {
        console.log("Update check failed", error);
      }
    }
    applyUpdate();
  }, []);

  const [fontsLoaded] = useFonts({
    ShuttleX: require("./assets/fonts/SHUTTLE-X.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <NavigationContainer>
            <StatusBar hidden={true} />
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Inscription" component={SignupScreen} />
              <Stack.Screen
                name="EquipementSelectionScreen"
                component={EquipementSelectionScreen}
              />
              <Stack.Screen name="TabNavigator" component={TabNavigator} />
            </Stack.Navigator>
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}
