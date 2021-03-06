import { Text, TouchableOpacity, View, StyleSheet } from "react-native";

export default function SettingsScreen(props: any) {
    const goBack = () => {
        props.navigation.navigate('Home');
    }

    return (
        <View>
            <TouchableOpacity style={styles.playButton} onPress={goBack}>
                <Text>Back</Text>
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