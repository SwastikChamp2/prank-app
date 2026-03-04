// pages/FAQ.tsx
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

interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

const FAQ = () => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();

    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const faqs: FAQItem[] = [
        {
            id: '1',
            question: 'Lorem ipsum dolor sit amet',
            answer: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
        },
        {
            id: '2',
            question: 'Lorem ipsum dolor sit amet',
            answer: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
        },
        {
            id: '3',
            question: 'Lorem ipsum dolor sit amet',
            answer: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
        },
        {
            id: '4',
            question: 'Lorem ipsum dolor sit amet',
            answer: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
        },
        {
            id: '5',
            question: 'Lorem ipsum dolor sit amet',
            answer: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
        },
    ];

    const filteredFAQs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleBack = () => {
        router.back();
    };

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text, fontFamily: Fonts.bold }]}>
                    Frequntly Asked Questions (FAQ)
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

            {/* FAQ List */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {filteredFAQs.map((faq, index) => (
                    <View
                        key={faq.id}
                        style={[
                            styles.faqCard,
                            {
                                backgroundColor: theme.background,
                                borderColor: expandedId === faq.id ? theme.primary : theme.border,
                            }
                        ]}
                    >
                        <TouchableOpacity
                            style={styles.faqItem}
                            onPress={() => toggleExpand(faq.id)}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.question,
                                    {
                                        color: theme.text,
                                        fontFamily: Fonts.semiBold
                                    }
                                ]}
                            >
                                {faq.question}
                            </Text>
                            <View style={[
                                styles.iconCircle,
                                { backgroundColor: expandedId === faq.id ? theme.primary : theme.lightGrey }
                            ]}>
                                <Ionicons
                                    name={expandedId === faq.id ? "chevron-up" : "chevron-down"}
                                    size={18}
                                    color={expandedId === faq.id ? '#FFFFFF' : theme.text}
                                />
                            </View>
                        </TouchableOpacity>

                        {expandedId === faq.id && (
                            <View style={styles.answerContainer}>
                                <View style={[styles.divider, { backgroundColor: theme.border }]} />
                                <Text
                                    style={[
                                        styles.answer,
                                        {
                                            color: theme.grey,
                                            fontFamily: Fonts.regular
                                        }
                                    ]}
                                >
                                    {faq.answer}
                                </Text>
                            </View>
                        )}
                    </View>
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
    faqCard: {
        marginBottom: 12,
        borderRadius: 16,
        borderWidth: 1.5,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    faqItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 16,
    },
    question: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        marginRight: 12,
        lineHeight: 22,
    },
    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    divider: {
        height: 1,
        marginBottom: 16,
    },
    answerContainer: {
        paddingHorizontal: 16,
        paddingBottom: 18,
    },
    answer: {
        fontSize: 14,
        lineHeight: 22,
    },
});

export default FAQ;