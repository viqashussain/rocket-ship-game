import AsyncStorage from '@react-native-async-storage/async-storage';
import { HighScore } from "./types/HighScore";

const localHighScoresKey = 'localHighScoresKey';
const userNameKey = 'userNameKey';

export const saveHighScoreLocally = async (newHighScore: HighScore) => {
    const localHighScores = await AsyncStorage.getItem(localHighScoresKey);
    let localHighScoresArray: HighScore[];

    if (localHighScores)
    {
        localHighScoresArray = JSON.parse(localHighScores);
    }
    // first time so the array does not yet exist
    else
    {
        localHighScoresArray = [];
    }

    localHighScoresArray.push(newHighScore);

    await AsyncStorage.setItem(localHighScoresKey, JSON.stringify(localHighScoresArray));
}

export const getLocalHighScores = async (): Promise<HighScore[]> => {
    const localHighScores = await AsyncStorage.getItem(localHighScoresKey);
    let localHighScoresArray: HighScore[] = [];

    if (localHighScores)
    {
        localHighScoresArray = JSON.parse(localHighScores);
    }

    return localHighScoresArray;
}

export const getUserName = async (): Promise<string> => {
    const username = await AsyncStorage.getItem(userNameKey);

    return username!;
}