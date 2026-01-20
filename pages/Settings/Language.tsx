// pages/Language.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../../constants/theme';
import { useLanguage } from '../../contexts/LanguageContext';

interface Language {
    id: string;
    name: string;
    flag: string;
}

const Language = () => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();
    const { selectedLanguage, setSelectedLanguage } = useLanguage();
    const [searchQuery, setSearchQuery] = React.useState('');

    const languages: Language[] = [
        { id: '1', name: 'English', flag: '🇬🇧' },
        { id: '2', name: 'Bahasa Indonesia', flag: '🇮🇩' },
        { id: '3', name: 'Chinese', flag: '🇨🇳' },
        { id: '4', name: 'Deutsch', flag: '🇩🇪' },
    ];

    const filteredLanguages = languages.filter(lang =>
        lang.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleBack = () => {
        router.back();
    };

    const handleLanguageSelect = (languageName: string) => {
        setSelectedLanguage(languageName);
        console.log('Language selected:', languageName);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text, fontFamily: Fonts.bold }]}>
                    Language
                </Text>
                <TouchableOpacity style={styles.moreButton}>
                    <Ionicons name="ellipsis-vertical" size={24} color={theme.text} />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={[styles.searchBar, { backgroundColor: theme.searchBg }]}>
                    <Ionicons name="search-outline" size={20} color={theme.grey} />
                    <TextInput
                        style={[styles.searchInput, { color: theme.text, fontFamily: Fonts.regular }]}
                        placeholder="Search language"
                        placeholderTextColor={theme.grey}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* Language List */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {filteredLanguages.map((language, index) => (
                    <TouchableOpacity
                        key={language.id}
                        style={[
                            styles.languageItem,
                            {
                                backgroundColor: theme.background,
                                borderColor: selectedLanguage === language.name ? theme.primary : theme.border,
                                borderWidth: selectedLanguage === language.name ? 2 : 1,
                            }
                        ]}
                        onPress={() => handleLanguageSelect(language.name)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.languageLeft}>
                            <Text style={styles.flagEmoji}>{language.flag}</Text>
                            <Text
                                style={[
                                    styles.languageName,
                                    {
                                        color: theme.text,
                                        fontFamily: Fonts.medium
                                    }
                                ]}
                            >
                                {language.name}
                            </Text>
                        </View>
                        {selectedLanguage === language.name && (
                            <Ionicons name="checkmark" size={24} color={theme.primary} />
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    moreButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        gap: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        paddingVertical: 0,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    languageItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    languageLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    flagEmoji: {
        fontSize: 28,
    },
    languageName: {
        fontSize: 16,
        fontWeight: '500',
    },
});

export default Language;