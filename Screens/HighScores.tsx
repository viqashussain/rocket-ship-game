import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet, ImageBackground, FlatList, SafeAreaView, Image } from "react-native";
import Constants from "../Constants";
import { getGlobalHighScores } from "../Firebase";
import { getLocalHighScores } from "../Storage";
import { GlobalHighScore, HighScore } from "../types/HighScore";
import { numberWithCommas } from "./Helpers";

export default function HighScoresScreen(props: any) {
    const goBack = () => {
        props.navigation.navigate('Home');
    }

    const [globallyRankedPersonalHighScore, setGloballyRankedPersonalHighScore] = useState<GlobalHighScore | undefined>([]);
    const [localHighScores, setLocalHighScores] = useState<HighScore[]>([]);
    const [globalHighScores, setGlobalHighScores] = useState<HighScore[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // fetch high scores from local upon load
    useEffect(() => {
        async function fetchAllLocalHighScores() {
            const localHighScores = await getLocalHighScores();

            // order by desc and set rank
            localHighScores.sort(function (a, b) {
                return b.score - a.score;
            }).map((x, i) => {
                x.rank = i + 1;
            });
            const globalHighScores = await getGlobalHighScores();

            globalHighScores.sort(function (a, b) {
                return b.score - a.score;
            }).map((x, i) => {
                x.rank = i + 1;
            });

            const currentBest = localHighScores[0];
            const globallyRankedPersonalHighScore = globalHighScores.find(x => x.id === currentBest.id);
            setGloballyRankedPersonalHighScore(globallyRankedPersonalHighScore);

            setLocalHighScores(localHighScores);
            setGlobalHighScores(globalHighScores);
            // setIsLoading(false);
        }

        fetchAllLocalHighScores();
    }, []);

    const renderLocalHighScore = (highScore: { item: HighScore }) => {
        return (
            <View>
                <Text style={[styles.textStyle]}>{highScore.item.rank}. {numberWithCommas(highScore.item.score)}</Text>
            </View>
        )
    }

    const renderGlobalHighScore = (highScore: { item: GlobalHighScore }) => {
        return (
            <View>
                <Text style={[styles.textStyle]}>{highScore.item.rank}. {numberWithCommas(highScore.item.score)}</Text>
                <Text style={[styles.textStyle]}>{highScore.item.user}</Text>
            </View>
        )
    }

    const background = require('../assets/img/highscore-background.png');
    const loadingBackground = require('../assets/img/loading_bg.png');
    const panel = require('../assets/img/highscore-panel.png');
    const backButton = require('../assets/img/back.png');
    const loadingText = require('../assets/img/loading_text.png');

    return (
        <View style={styles.container}>

            {
                isLoading ?
                    <ImageBackground source={loadingBackground} resizeMode="cover" style={styles.backgroundImage}>
                        <Image resizeMode="contain" style={styles.loadingText} source={loadingText}></Image>
                    </ImageBackground>
                    :

                    <ImageBackground resizeMode="stretch" source={background} style={styles.backgroundImage}>

                        <ImageBackground source={panel} style={styles.panelImage}>
                            <SafeAreaView style={styles.scoreListsContainer}>
                                <FlatList
                                    style={styles.localFlatList}
                                    data={localHighScores}
                                    renderItem={renderLocalHighScore}
                                    keyExtractor={(item: HighScore) => item.id}
                                />

                                <View style={styles.globalFlatListContainer}>

                                    <FlatList
                                        style={styles.globalFlatList}
                                        data={globalHighScores}
                                        renderItem={renderGlobalHighScore}
                                        keyExtractor={(item: any) => item.id}
                                    />
                                    {
                                        globallyRankedPersonalHighScore &&
                                        <Text style={[styles.globallyRankedPersonalHighScore, styles.textStyle]}>My Best: {globallyRankedPersonalHighScore.rank}. {numberWithCommas(globallyRankedPersonalHighScore.score)}</Text>
                                    }
                                </View>
                            </SafeAreaView>
                        </ImageBackground>
                        <View style={styles.goBackButtonContainer}>
                            <TouchableOpacity style={styles.goBackButton} onPress={goBack}>
                                <Image style={styles.goBackButtonImage} source={backButton}></Image>
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    backButton: {
        height: 500,
        width: '100%',
        backgroundColor: 'green'
    },
    scoreListsContainer: {
        flexDirection: 'row',
        flex: 5,
        marginTop: 100,
        marginBottom: 15
    },
    localFlatList: {
        marginLeft: 25
    },
    globalFlatList: {
        marginBottom: 25,
        marginLeft: 25
    },
    globallyRankedPersonalHighScore: {
        marginLeft: 25
    },
    backgroundImage: {
        width: Constants.MAX_WIDTH,
        flex: 1,
        justifyContent: "center"
    },
    panelImage: {
        width: Constants.MAX_WIDTH,
        height: 600,
        resizeMode: 'contain',
        position: 'absolute'
    },
    container: {
        flex: 1,
    },
    testText: {
        fontSize: 50
    },
    goBackButtonContainer: {
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        width: Constants.MAX_WIDTH
    },
    goBackButton: {
        flex: 1,
    },
    goBackButtonImage: {
        resizeMode: 'contain',
        width: 250,
        height: 100,
        flex: 1,
    },
    textStyle: {
        fontFamily: 'SpaceCadetNF',
        paddingBottom: 5
    },
    globalFlatListContainer: {
        justifyContent: 'center',
        flexDirection: 'column',
        flex: 2,
    },
    loadingText: {
        position: 'absolute',
        bottom: 0,
        width: Constants.MAX_WIDTH - 100,
        margin: 50
      },
});
