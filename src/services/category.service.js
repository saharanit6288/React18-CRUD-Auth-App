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

const categoryCollectionRef = collection(db, "categories");

class CategoryService {
    addCategory = (data) => {
        return addDoc(categoryCollectionRef,data);
    }

    updateCategory = (id, data) => {
        const dataDoc = doc(db, "categories", id);
        return updateDoc(dataDoc, data);
    }

    deleteCategory = (id) => {
        const dataDoc = doc(db, "categories", id);
        return deleteDoc(dataDoc);
    }

    getAllCategory = () => {
        return getDocs(categoryCollectionRef);
    }

    getSingleCategory = (id) => {
        const dataDoc = doc(db, "categories", id);
        return getDoc(dataDoc);
    }
}

export default new CategoryService();