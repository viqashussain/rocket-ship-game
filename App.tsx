import React from "react";
import { Provider } from 'react-redux';
import Game from "./Screens/Game";
// import Game from "./Components/Game";
import { store } from "./redux/Store";
import StartScreen from "./Screens/Start";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export default function App() {
  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     running: false,
  //     health: 100,
  //     world: null,
  //     level: 1
  //   };

  //   // this.gameEngine = null;

  //   // this.entities = this.setupWorld();
  // }

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Provider store={store}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={StartScreen} />
          <Stack.Screen name="Game" component={Game} />
        </Stack.Navigator>
      </Provider >
    </NavigationContainer>
  );
}
