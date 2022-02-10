import firebase from "firebase";
import { getUserName } from "./Storage";
import { HighScore, GlobalHighScore } from "./types/HighScore";

const firebaseConfig = {
    apiKey: "AIzaSyBlS94UUfbxgo9Woc0KFjeXPNxqIQ5sAgQ",
    authDomain: "rocket-ship-game.firebaseapp.com",
    projectId: "rocket-ship-game",
    storageBucket: "rocket-ship-game.appspot.com",
    messagingSenderId: "173407629518",
    appId: "1:173407629518:web:464f385fa74a8e820fa09f",
    measurementId: "G-J0BS9RZZ1F"
};

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

export const saveGlobalHighScore = async (highscore: HighScore) => {
    const username = await getUserName();
    const globaHighScore: GlobalHighScore = {
        ...highscore,
        user: username
    }
    db.collection('highscores').doc().set(globaHighScore);
}