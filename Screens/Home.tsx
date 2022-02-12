import { Text, View, StyleSheet, ImageBackground, Image, TouchableOpacity } from "react-native";
import { useFonts } from 'expo-font';
import React from "react";
import Constants from "../Constants";

export default function HomeScreen(props: any) {
    const startGame = () => {
        props.navigation.navigate('Game');
    }

    const goToSettings = () => {
        props.navigation.navigate('Settings');
    }

    const goToHelp = () => {
        props.navigation.navigate('Help');
    }

    const goToHighScores = () => {
        props.navigation.navigate('HighScores');
    }

    const imageBackground = require('../assets/img/homebackground.png');
    const playButton = require('../assets/img/play.png');
    const highscoreButton = require('../assets/img/highscore.png');
    const helpButton = require('../assets/img/help.png');

    return (
        <ImageBackground source={imageBackground} resizeMode="cover" style={styles.backgroundImage}>

            <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={startGame}>
                    <Image source={playButton}></Image>
                </TouchableOpacity>

                <TouchableOpacity onPress={goToHighScores}>
                    <Image source={highscoreButton}></Image>
                </TouchableOpacity>

                <TouchableOpacity onPress={goToHelp}>
                    <Image source={helpButton}></Image>
                </TouchableOpacity>
            </View>

        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    buttonsContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        top: (Constants.MAX_HEIGHT / 3) * 2
    },
    backgroundImage: {
        width: Constants.MAX_WIDTH,
        flex: 1,
        justifyContent: "center"
    },
});