import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LanguageContextType {
    selectedLanguage: string;
    setSelectedLanguage: (language: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const [selectedLanguage, setSelectedLanguageState] = useState('English');

    // Load saved language from localStorage on mount
    useEffect(() => {
        try {
            const savedLanguage = localStorage.getItem('selectedLanguage');
            if (savedLanguage) {
                setSelectedLanguageState(savedLanguage);
            }
        } catch (error) {
            console.log('localStorage not available, using default language');
        }
    }, []);

    const setSelectedLanguage = (language: string) => {
        setSelectedLanguageState(language);
        try {
            localStorage.setItem('selectedLanguage', language);
        } catch (error) {
            console.log('localStorage not available, language not persisted');
        }
    };

    return (
        <LanguageContext.Provider value={{ selectedLanguage, setSelectedLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
