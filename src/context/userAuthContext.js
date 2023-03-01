import { createContext, useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import {auth} from '../firebase';

const userAuthContext = createContext();

export function UserAuthContextProvider({children}) {

    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

    function register(email,password){
        const res = createUserWithEmailAndPassword(auth,email,password);
        return res;
    }

    function login(email,password){
        const res = signInWithEmailAndPassword(auth,email,password);
        return res;
    }

    function logout(){
        const res = signOut(auth);
        return res;
    }

    useEffect(() => {
        const unsubscribe=onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            localStorage.setItem("user",JSON.stringify(currentUser));
        });
        return () => {
            unsubscribe();
        }
    }, [user]);

    return <userAuthContext.Provider value={{user, register, login, logout}}>
        {children}
    </userAuthContext.Provider>
}

export function useUserAuth() {
    return useContext(userAuthContext);
}