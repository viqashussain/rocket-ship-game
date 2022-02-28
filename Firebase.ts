import firebase from "firebase";
import { getUserName } from "./Storage";
import { HighScore, GlobalHighScore } from "./types/HighScore";

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

export const getGlobalHighScores = async (): Promise<GlobalHighScore[]> => {
    const ref = db.collection('highscores');
    const doc = await ref.get();
    const highscores = doc.docs.map(x => {
        return x.data();
    });
    return highscores as GlobalHighScore[];
}

export const isUserNameTakenInFireBase = async (userName: string): Promise<boolean> => {
    const ref = db.collection('highscores');
    const doc = await ref.get();
    return doc.docs.some(x => {
        return (x.data() as GlobalHighScore).user === userName;
    });
}

export const saveGlobalHighScore = async (highscore: HighScore) => {
    const username = await getUserName();
    const globaHighScore: GlobalHighScore = {
        ...highscore,
        user: username
    }
    db.collection('highscores').doc().set(globaHighScore);
}
