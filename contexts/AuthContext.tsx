import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    ReactNode,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../config/firebase.config";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    isAuthenticated: false,
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('AuthProvider: Setting up auth listener');

        // Set up Firebase auth state listener
        // Firebase will automatically restore the session from AsyncStorage
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            console.log('Auth state changed:', firebaseUser ? 'User logged in' : 'No user');
            console.log('User ID:', firebaseUser?.uid);

            setUser(firebaseUser);
            setLoading(false);
        });

        return () => {
            console.log('AuthProvider: Cleaning up auth listener');
            unsubscribe();
        };
    }, []);

    const contextValue = {
        user,
        loading,
        isAuthenticated: !!user,
    };

    console.log('AuthProvider render:', { isAuthenticated: contextValue.isAuthenticated, loading });

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);