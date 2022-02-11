import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useFonts } from 'expo-font';

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

    let [fontsLoaded] = useFonts({
        'SpaceCadetNF': require('../assets/fonts/SpaceCadetNF.otf'),
    });

    if (!fontsLoaded) {
        return <Text>Loading...</Text>;
    }


    return (
        <View>
            <TouchableOpacity style={styles.playButton} onPress={startGame}>
                <Text style={styles.helpButtonText}>Play!</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingsButton} onPress={goToSettings}>
                <Text>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.highScoresButton} onPress={goToHighScores}>
                <Text>High Scores</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.helpButton} onPress={goToHelp}>
                <Text>Help</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    playButton: {
        height: 200,
        width: '100%',
        backgroundColor: 'red'
    },
    settingsButton: {
        height: 200,
        width: '100%',
        backgroundColor: 'green'
    },
    highScoresButton: {
        height: 200,
        width: '100%',
        backgroundColor: 'blue'
    },
    helpButton: {
        height: 200,
        width: '100%',
        backgroundColor: 'yellow'
    },
    helpButtonText: {
        fontSize: 100,
        fontFamily: 'SpaceCadetNF'
    }
});