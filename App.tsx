import React, { useEffect, useState } from "react";
import { Provider } from 'react-redux';
import Game from "./Screens/Game";
import { store } from "./redux/Store";
import HomeScreen from "./Screens/Home";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SettingsScreen from "./Screens/Settings";
import HighScoresScreen from "./Screens/HighScores";
import HelpScreen from "./Screens/Help";
import { getUserName, storeUserName } from "./Storage";
import { Alert, ImageBackground, Modal, Pressable, StyleSheet, View, Text, TextInput } from "react-native";
import Constants from "./Constants";
import { isUserNameTakenInFireBase } from "./Firebase";
import { useFonts } from "expo-font";

export default function App() {
  const Stack = createNativeStackNavigator();

  const [userName, setUserName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isUserNameTaken, setIsUserNameTaken] = useState<boolean>(false);
  const [takenUserName, setTakenUserName] = useState<string>('');

  let [fontsLoaded] = useFonts({
    'SpaceCadetNF': require('./assets/fonts/SpaceCadetNF.otf'),
  });

  // get username on load, if it doesn't exist, prompt user for it
  useEffect(() => {
    async function asyncGetUserName() {
      const userName = await getUserName();
      if (!userName) {
        setModalVisible(true);
      }
      setIsLoading(false);
    }

    asyncGetUserName();
  }, []);
  
  const save = async () => {
    if (!userName.trim()) {
      Alert.alert('Please enter a user name.');
      return;
    }
    const isUserNameTakenInFirebaseConst = await isUserNameTakenInFireBase(userName);
    setIsLoading(false);
    if (isUserNameTakenInFirebaseConst) {
      setIsUserNameTaken(true);
      setTakenUserName(userName);
    }
    else {
      await storeUserName(userName);
      setModalVisible(false);
      setTakenUserName('');
    }
  };

  const imageBackground = require('./assets/img/splash.png');

  return (
    (isLoading || !fontsLoaded) === true ?

      <ImageBackground source={imageBackground} resizeMode="cover" style={styles.backgroundImage}></ImageBackground>

      :
      <React.Fragment>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Please enter a user name. This will be used save your high scores.</Text>
              {
                isUserNameTaken &&
                <Text style={styles.modalText}>
                  The user name {takenUserName} is taken, please enter a different user name.
                </Text>
              }
              <TextInput style={styles.input} onChangeText={setUserName} />


              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={async () => save()}>
                <Text style={styles.textStyle}>Save</Text>
              </Pressable>

            </View>
          </View>
        </Modal>
        <NavigationContainer>
          <Provider store={store}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Game" component={Game} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
              <Stack.Screen name="HighScores" component={HighScoresScreen} />
              <Stack.Screen name="Help" component={HelpScreen} />
            </Stack.Navigator>
          </Provider>
        </NavigationContainer>
      </React.Fragment>
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: Constants.MAX_WIDTH,
    flex: 1,
    justifyContent: "center"
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontFamily: 'SpaceCadetNF'
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 20
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    textAlign: "center",
    fontFamily: 'SpaceCadetNF'
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: Constants.MAX_WIDTH / 2
  },
});