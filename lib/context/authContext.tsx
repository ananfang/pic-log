'use client'

import { User, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth"
import { GoogleAuthProvider } from "firebase/auth";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { firebaseAuth } from "../firebase/firebase";

type AuthContextType = {
    currentUser: User | null;
    logInWithGoogle: () => Promise<void>;
    logOut: () => Promise<void>;
    errorMessage: string | null;
    isInitialized: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [isInitialized, setIsInitialized] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
            console.log('🙂‍↔️ Current user id: ', user?.uid)
            setCurrentUser(user)
            setIsInitialized(true)
            setIsLoading(false)
        })

        return () => {
            unsubscribe()
        }
    }, [])

    const logInWithGoogle = async () => {
        setErrorMessage(null)
        const googleProvider = new GoogleAuthProvider()

        try {
            setIsLoading(true)
            await signInWithPopup(firebaseAuth, googleProvider)
        } catch (error: any) {
            const errMessage = error.message || error
            setErrorMessage(errMessage)
            console.error(errMessage)
            setIsLoading(false)
        }
    }

    const logOut = async () => {
        setErrorMessage(null)

        try {
            setIsLoading(true)
            await signOut(firebaseAuth)
        } catch (error: any) {
            const errMessage = error.message || error
            setErrorMessage(errMessage)
            console.error(errMessage)
            setIsLoading(false)
        }
    }

    return (
        <AuthContext.Provider value={{ currentUser, logInWithGoogle, logOut, errorMessage, isInitialized, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error('useAuth must be used within a AuthProvider')
    }

    return context
}
