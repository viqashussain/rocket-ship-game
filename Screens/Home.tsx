import { Text, View, StyleSheet, ImageBackground, Image, TouchableOpacity, Platform, PixelRatio } from "react-native";
import { useFonts } from 'expo-font';
import React, { useEffect } from "react";
import Constants from "../Constants";
import { normalize } from "./Helpers";

export default function HomeScreen(props: any) {

    useEffect(() => {
        console.log(Platform.OS)
        console.log(Constants.MAX_HEIGHT)
    }, []);

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
        <ImageBackground source={imageBackground} resizeMode="stretch" style={styles.backgroundImage}>

            <View style={styles.emptyContainer}></View>

            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button} onPress={startGame}>
                    <Image resizeMode="contain" style={styles.buttonImage} source={playButton}></Image>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={goToHighScores}>
                    <Image resizeMode="contain" style={styles.buttonImage} source={highscoreButton}></Image>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={goToHelp}>
                    <Image resizeMode="contain" style={styles.buttonImage} source={helpButton}></Image>
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
        flexBasis: '35%',
        justifyContent: 'space-around'
    },
    emptyContainer:
    {
        flexBasis: '65%'
    },
    backgroundImage: {
        width: Constants.MAX_WIDTH,
        flex: 1,
        justifyContent: "center"
    },
    buttonImage: {
        resizeMode: 'contain',
        width: Constants.MAX_WIDTH / 2,
        flex: 1
    },
    button: {
        resizeMode: 'contain',
        width: Constants.MAX_WIDTH / 2,
        flexBasis: '33%',
        flex: 1
    }
});