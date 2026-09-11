
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "examnotesai-fbce0.firebaseapp.com",
    projectId: "examnotesai-fbce0",
    storageBucket: "examnotesai-fbce0.firebasestorage.app",
    messagingSenderId: "126583739947",
    appId: "1:126583739947:web:2455c99ecfe618fffb3c6e"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export {auth , provider}