import { db } from "../firebase";
import { 
    collection,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query, orderBy
 } 
from "firebase/firestore";

const watchlistCollectionRef = collection(db, "watchlist");

class WatchlistService {
    addWatchlist = (data) => {
        return addDoc(watchlistCollectionRef,data);
    }

    updateWatchlist = (id, data) => {
        const dataDoc = doc(db, "watchlist", id);
        return updateDoc(dataDoc, data);
    }

    deleteWatchlist = (id) => {
        const dataDoc = doc(db, "watchlist", id);
        return deleteDoc(dataDoc);
    }

    getAllWatchlist = () => {
        const q = query(watchlistCollectionRef, orderBy("createdOn", "desc"));
        return getDocs(q);
    }

    getSingleWatchlist = (id) => {
        const dataDoc = doc(db, "watchlist", id);
        return getDoc(dataDoc);
    }
}

export default new WatchlistService();