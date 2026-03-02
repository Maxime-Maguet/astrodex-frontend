import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store'; 

import ObservationScreen from "./screens/ObservationScreen"; 
import LoginScreen from "./screens/LoginScreen";           

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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
      <PersistGate loading={null} persistor={persistor}>
        <Navigation />
        <StatusBar style="auto" />
      </PersistGate>
    </Provider>
  );
}