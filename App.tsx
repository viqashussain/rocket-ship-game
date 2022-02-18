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
import { Alert, ImageBackground, Modal, Pressable, StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from "react-native";
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
    setUserName(userName.trim());
    const formattedUserName = userName.trim();
    if (!formattedUserName) {
      Alert.alert('Please enter a user name.');
      return;
    }
    const isUserNameTakenInFirebaseConst = await isUserNameTakenInFireBase(formattedUserName);
    setIsLoading(false);
    if (isUserNameTakenInFirebaseConst) {
      setIsUserNameTaken(true);
      setTakenUserName(formattedUserName);
    }
    else {
      await storeUserName(formattedUserName);
      setModalVisible(false);
      setTakenUserName('');
    }
  };

  const imageBackground = require('./assets/img/splash.png');
  const loadingBackground = require('./assets/img/loading_bg.png');
  const loadingText = require('./assets/img/loading_text.png');
  const modalBackground = require('./assets/img/modalpanel.png');
  const saveButton = require('./assets/img/save.png');

  return (
    (isLoading || !fontsLoaded) === true ?

      <ImageBackground source={loadingBackground} resizeMode="cover" style={styles.backgroundImage}>
        <Image resizeMode="contain" style={styles.loadingText} source={loadingText}></Image>
      </ImageBackground>

      :
      <React.Fragment>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
        >
          <View style={styles.centeredView}>
            <ImageBackground source={modalBackground} style={styles.modalPanelBackgroundImage}>
              <Text style={styles.modalText}>Please enter a user name. This will be used save your high scores.</Text>
              {
                isUserNameTaken &&
                <Text style={styles.modalText}>
                  The user name {takenUserName} is taken, please enter a different user name.
                </Text>
              }
              <TextInput style={styles.input} onChangeText={setUserName} />


              <TouchableOpacity style={styles.modalButton} onPress={save}>
                <Image source={saveButton} style={styles.modalButtonImage}></Image>
              </TouchableOpacity>

            </ImageBackground>
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
  loadingText: {
    position: 'absolute',
    bottom: 0,
    width: Constants.MAX_WIDTH - 100,
    margin: 50
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontFamily: 'SpaceCadetNF'
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 20,
    backgroundColor: '#9c9f9c',
    color: 'black'
  },
  textStyle: {
    textAlign: "center",
    fontFamily: 'SpaceCadetNF'
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: Constants.MAX_WIDTH / 2,
    backgroundColor: 'white'
  },
  modalPanelBackgroundImage: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    padding: 20,
    resizeMode: 'contain'
  },
  modalButton: {
    width: 100,
    alignItems: 'center'
  },
  modalButtonImage: {
    height: 50,
    width: 150,
    resizeMode: 'contain'
  },
});