import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth} from 'firebase/auth';
 
const firebaseConfig = {

  apiKey: "xxxxxx",

  authDomain: "xxxxxxx",

  projectId: "xxxxxxxxx",

  storageBucket: "xxxxxxxxxx",

  messagingSenderId: "xxxxxxxxxxx",

  appId: "xxxxxxxxxx"

};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;