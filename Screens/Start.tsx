import { Text, TouchableOpacity, View, StyleSheet } from "react-native";

export default function StartScreen(props: any) {
    const startGame = () => {
        props.navigation.navigate('Game');
    }

    return (
        <View>
            <TouchableOpacity style={styles.playButton} onPress={startGame}>
                <Text>Play!</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    playButton: {
        paddingTop: 50,
        height: 500,
        width: '100%',
        backgroundColor: 'red'
    }
});