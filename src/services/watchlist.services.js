import { db } from "../firebase";
import { 
    collection,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query, 
    where,
    limit,
    limitToLast,
    startAfter,
    endBefore,
    orderBy
 } 
from "firebase/firestore";

const watchlistCollectionRef = collection(db, "watchlist");
let pageSize = 25;

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

    getWatchlistTotalCount = async () => {
        const q = query(watchlistCollectionRef,
            orderBy("createdOn", "desc"));

        const data = await getDocs(q);

        return data.docs.length;
    }

    getWatchlistFirst = () => {
        const q = query(watchlistCollectionRef,
            orderBy("createdOn", "desc"),
            limit(pageSize));
        return getDocs(q);
    }

    getWatchlistNext = (createdOn) => {
        const q = query(watchlistCollectionRef,
            orderBy("createdOn", "desc"),
            startAfter(createdOn),
            limit(pageSize));
        return getDocs(q);
    }

    getWatchlistPrev = (createdOn) => {
        const q = query(watchlistCollectionRef,
            orderBy("createdOn", "desc"),
            endBefore(createdOn),
            limitToLast(pageSize));
        return getDocs(q);
    }

    getSearchWatchlist = (data) => {
        let titleArr = data.title.toLowerCase().split(' ');

        let titleConstraint = data.title !== '' 
            ? (where('searchTitle', 'array-contains-any', titleArr))
            : (where('title', '!=', ''), orderBy("title", "asc"));

        let categoryConstraint = data.categoryId !== '' 
            ? where('categoryId', '==', data.categoryId)
            : (where('categoryId', '!=', ''), orderBy("categoryId", "asc"));

        let languageConstraint = data.languageId !== '' 
            ? where('languageId', '==', data.languageId)
            : (where('languageId', '!=', ''), orderBy("languageId", "asc"));

        const q = query(watchlistCollectionRef,
            titleConstraint,
            categoryConstraint,
            languageConstraint,
            orderBy("createdOn", "desc"));

        return getDocs(q);
    }


    getSingleWatchlist = (id) => {
        const dataDoc = doc(db, "watchlist", id);
        return getDoc(dataDoc);
    }
}

export default new WatchlistService();