import React from "react";
import { View } from 'react-native';
import { Provider } from 'react-redux';
import Game from "./Components/Game";
// import Game from "./Components/Game";
import { store } from "./redux/Store";

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

  return (
    <Provider store={store}>
      <View></View>
      <Game />
    </Provider>
  );


  // scoreCounter = (entities, { touches, time }) => {
  //   this.setState({
  //     ...this.state,
  //     score: this.state.score + 1
  //   });

  //   if (this.state.score > 3000 && this.state.level === 1) {
  //     this.setState({
  //       ...this.state,
  //       level: 2
  //     });
  //   }
  //   else if (this.state.score > 6000 && this.state.level === 2) {
  //     this.setState({
  //       ...this.state,
  //       level: 3
  //     });
  //   }

  //   return entities;
  // }
}