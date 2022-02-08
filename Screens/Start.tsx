import { Text, TouchableOpacity, View, StyleSheet } from "react-native";

export default function StartScreen(props: any) {
    const startGame = () => {
        props.navigation.navigate('Game');
    }

    const goToSettings = () => {
        props.navigation.navigate('Settings');
    }

    return (
        <View>
            <TouchableOpacity style={styles.playButton} onPress={startGame}>
                <Text>Play!</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingsButton} onPress={goToSettings}>
                <Text>Settings</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    playButton: {
        height: 500,
        width: '100%',
        backgroundColor: 'red'
    },
    settingsButton: {
        height: 500,
        width: '100%',
        backgroundColor: 'green'
    }
});