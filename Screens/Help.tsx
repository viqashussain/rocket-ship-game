import { Text, TouchableOpacity, View, StyleSheet, ImageBackground, Image, PixelRatio, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "../Constants";
import { normalize } from "./Helpers";

export default function HelpScreen(props: any) {
    const goBack = () => {
        props.navigation.navigate('Home');
    }

    const background = require('../assets/img/help-background.png');
    const helpText = require('../assets/img/help-text.png');
    const backButton = require('../assets/img/back.png');
    const helpPanel = require('../assets/img/helppanel.png');

    const rocket = require('../assets/img/rocket.png');
    const asteroid = require('../assets/img/asteroid.png');
    const fuel = require('../assets/img/fuel.png');
    const jewel = require('../assets/img/goldcoin.gif');

    return (
        <View style={styles.container}>

            <ImageBackground source={background} resizeMode="stretch" style={styles.backgroundImage}>
                <Image resizeMode="contain" style={styles.helpText} source={helpText}></Image>
                <ImageBackground source={helpPanel} resizeMode="stretch" style={styles.helpPanel}>

                    <ScrollView>

                        <View style={styles.helpPanelContainer}>
                            <Text style={styles.textStyle}>You are the rocket in the Rocket Ship Explorer flying through space collecting valuable minerals. As you fly, you'll need to avoid the asteroids. Hit too many asteroids and your rocket will be too damaged to fly. You can collect fuel floating about in space to regain your health.</Text>
                            <Text style={styles.textStyle}>Simply tap on the screen to make your rocket fly. Tapping further to the left or right will propel you in that direction.</Text>
                        </View>

                        <View style={styles.imagesItemsContainer}>
                            <View style={styles.helpItemContainer}>
                                <Image style={styles.rocketImage} source={rocket}></Image>
                                <Text style={styles.helpTextStyle}>This rocket is you. Tap to make the rocket fly.</Text>
                            </View>
                            <View style={styles.helpItemContainer}>
                                <Image style={styles.asteroidImage} source={asteroid}></Image>
                                <Text style={styles.helpTextStyle}>Avoid the asteroids. As you progress, the asteroids will be become larger.</Text>
                            </View>
                            <View style={styles.helpItemContainer}>
                                <Image style={styles.fuelImage} source={fuel}></Image>
                                <Text style={styles.helpTextStyle}>Obtain the fuel by flying into it to regain your health.</Text>
                            </View>
                            <View style={styles.helpItemContainer}>
                                <Image style={styles.jewelImage} source={jewel}></Image>
                                <Text style={styles.helpTextStyle}>Obtain the jewels by flying into them to increase your score. The further you progress, the more points the jewels will be worth.</Text>
                            </View>
                        </View>
                    </ScrollView>
                </ImageBackground>
                <View style={styles.goBackButtonContainer}>
                    <TouchableOpacity style={styles.goBackButton} onPress={goBack}>
                        <Image style={styles.goBackButtonImage} source={backButton}></Image>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row'
    },
    goBackButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 20,
        width: Constants.MAX_WIDTH,
        flexBasis: '10%',
    },
    goBackButton: {
        alignItems: 'center',
        flex: 1
    },
    goBackButtonImage: {
        resizeMode: 'contain',
        width: Constants.MAX_WIDTH / 2,
        height: 100,
    },
    backgroundImage: {
        width: Constants.MAX_WIDTH,
        flex: 1,
        justifyContent: "center"
    },
    helpPanel: {
        width: Constants.MAX_WIDTH,
        resizeMode: 'contain',
        paddingBottom: 20,
        flexBasis: '70%',
        flex: 1
    },
    helpPanelContainer: {
        padding: 20
    },
    textStyle: {
        textAlign: "center",
        fontFamily: 'SpaceCadetNF',
        fontSize: normalize(14),
    },
    helpTextStyle: {
        textAlign: "center",
        fontFamily: 'SpaceCadetNF',
        fontSize: normalize(14),
        paddingLeft: 20 / PixelRatio.get(),
    },
    rocketImage: {
        height: 30 * PixelRatio.get(),
        width: 20 * PixelRatio.get(),
        resizeMode: 'contain'
    },
    asteroidImage: {
        height: 20 * PixelRatio.get(),
        width: 20 * PixelRatio.get(),
        resizeMode: 'contain'
    },
    fuelImage: {
        height: 20 * PixelRatio.get(),
        width: 20 * PixelRatio.get(),
        resizeMode: 'contain'
    },
    jewelImage: {
        height: 20 * PixelRatio.get(),
        width: 20 * PixelRatio.get(),
        resizeMode: 'contain'
    },
    imagesItemsContainer: {
        flexDirection: 'column',
    },
    helpItemContainer: {
        flexDirection: 'row',
        paddingLeft: 60 / PixelRatio.get(),
        marginRight: 75,
        marginBottom: 20 / PixelRatio.get(),
        alignItems: 'center'
    },
    helpText: {
        flexBasis: '20%',
        width: Constants.MAX_WIDTH - 100,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
});