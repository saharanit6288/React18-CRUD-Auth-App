import { db } from "../firebase";
import { 
    collection,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    doc } 
from "firebase/firestore";

const languageCollectionRef = collection(db, "languages");

class LanguageService {
    addLanguage = (data) => {
        return addDoc(languageCollectionRef,data);
    }

    updateLanguage = (id, data) => {
        const dataDoc = doc(db, "languages", id);
        return updateDoc(dataDoc, data);
    }

    deleteLanguage = (id) => {
        const dataDoc = doc(db, "languages", id);
        return deleteDoc(dataDoc);
    }

    getAllLanguage = () => {
        return getDocs(languageCollectionRef);
    }

    getSingleLanguage = (id) => {
        const dataDoc = doc(db, "languages", id);
        return getDoc(dataDoc);
    }
}

export default new LanguageService();