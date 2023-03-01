import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth} from 'firebase/auth';
 
const firebaseConfig = {

  apiKey: "AIzaSyBncwrkKo8EgeUu9vrQ0FHQ6BvVGciX6iU",

  authDomain: "mywatchlist-5acc3.firebaseapp.com",

  projectId: "mywatchlist-5acc3",

  storageBucket: "mywatchlist-5acc3.appspot.com",

  messagingSenderId: "381812625469",

  appId: "1:381812625469:web:c7c3effafc0a05b0299a54"

};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;