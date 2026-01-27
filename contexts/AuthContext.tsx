// context/AuthContext.tsx
import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    ReactNode,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../config/firebase.config";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
        // Initialize auth state - check for persistent login
        const initializeAuth = async () => {
            try {
                // Check if persistent login is enabled
                const persistLogin = await AsyncStorage.getItem("persistLogin");

                // Set loading to false - Firebase will handle auth state
                // This prevents the app from staying in loading state indefinitely
                setLoading(false);
            } catch (error) {
                console.error("Error initializing auth:", error);
                setLoading(false);
            }
        };

        initializeAuth();

        // Set up Firebase auth state listener
        // This will restore the user session if they were previously logged in
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try {
                if (user) {
                    // User is logged in - Firebase has restored the session
                    setUser(user);
                    await AsyncStorage.setItem("userToken", user.uid);
                    // Ensure persistent login is enabled
                    await AsyncStorage.setItem("persistLogin", "true");
                    console.log("Session restored for user:", user.uid);
                } else {
                    // User is logged out
                    setUser(null);
                    // Check if we should clear persistent data
                    const persistLogin = await AsyncStorage.getItem("persistLogin");
                    if (persistLogin === "false") {
                        // User explicitly disabled persistent login
                        await AsyncStorage.removeItem("userToken");
                        await AsyncStorage.removeItem("persistLogin");
                    }
                }
                setLoading(false);
            } catch (error) {
                console.error("Error in auth state change:", error);
                setLoading(false);
            }
        });

        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);