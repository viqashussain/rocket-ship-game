import React from "react";
import { Provider } from 'react-redux';
import Game from "./Screens/Game";
import { store } from "./redux/Store";
import HomeScreen from "./Screens/Home";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SettingsScreen from "./Screens/Settings";
import HighScoresScreen from "./Screens/HighScores";
import HelpScreen from "./Screens/Help";

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Provider store={store}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Game" component={Game} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="HighScores" component={HighScoresScreen} />
          <Stack.Screen name="Help" component={HelpScreen} />
        </Stack.Navigator>
      </Provider >
    </NavigationContainer>
  );
}
