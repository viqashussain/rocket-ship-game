import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { getGlobalHighScores } from "../Firebase";
import { getLocalHighScores } from "../Storage";
import { GlobalHighScore as HighScore } from "../types/HighScore";

export default function HighScoresScreen(props: any) {
    const goBack = () => {
        props.navigation.navigate('Home');
    }

    const [localHighScores, setLocalHighScores] = useState<HighScore[]>([]);
    const [globalHighScores, setGlobalHighScores] = useState<HighScore[]>([]);

    // fetch high scores from local upon load
    useEffect(() => {
        async function fetchAllLocalHighScores() {
            const localHighScores = await getLocalHighScores();
            const globalHighScores = await getGlobalHighScores();
            setLocalHighScores(localHighScores);
            setGlobalHighScores(globalHighScores);
        }

        fetchAllLocalHighScores();
    }, []);

    return (
        <View>
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
                <Text>Back</Text>
                {localHighScores.map((item) => (
                    <Text key={item.id}> {item.score}</Text>
                ))}

                <Text>Global:</Text>
                {globalHighScores.map((item) => (
                    <Text key={item.id}> {item.score}</Text>
                ))}
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    backButton: {
        paddingTop: 50,
        height: 500,
        width: '100%',
        backgroundColor: 'green'
    }
});

