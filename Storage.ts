import AsyncStorage from '@react-native-async-storage/async-storage';
import { HighScore } from "./types/HighScore";

const localHighScoresKey = 'localHighScoresKey';
const userNameKey = 'userNameKey';
const firstGameKey = 'firstGameKey';

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

export const storeUserName = async (userName: string): Promise<void> => {
    await AsyncStorage.setItem(userNameKey, userName);
}

export const getIsFirstGame = async (): Promise<boolean> => {
    const firstGame = await AsyncStorage.getItem(firstGameKey);

    return firstGame == null;
} 

export const setIsFirstGameInFb = async (): Promise<void> => {
    await AsyncStorage.setItem(firstGameKey, 'true');
}

// export const clear = async (): Promise<void> => {
//     await AsyncStorage.removeItem(userNameKey);
// }