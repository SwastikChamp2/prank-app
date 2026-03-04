// pages/PrivacyPolicy.tsx
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../../constants/theme';

const PrivacyPolicy = () => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text, fontFamily: Fonts.bold }]}>
                    Privacy Policy
                </Text>
                <TouchableOpacity style={styles.moreButton}>
                    <Ionicons name="ellipsis-vertical" size={24} color={theme.text} />
                </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView
                showsVerticalScrollIndicator={true}
                persistentScrollbar={true}
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                indicatorStyle={colorScheme === 'dark' ? 'white' : 'black'}
            >
                {/* Data Collection Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                        Data Collection
                    </Text>
                    <Text style={[styles.bodyText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget ornare quam vel facilisis
                        feugiat amet sagittis arcu, tortor. Sapien, consequat ultrices morbi orci semper sit nulla. Leo
                        auctor ut etiam est, amet aliquet ut vivamus. Odio vulputate est id tincidunt fames.
                    </Text>
                    <Text style={[styles.bodyText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget ornare quam vel facilisis
                        feugiat amet sagittis arcu, tortor. Sapien, consequat ultrices morbi orci semper sit nulla. Leo
                        auctor ut etiam est, amet aliquet ut vivamus. Odio vulputate est id tincidunt fames.
                    </Text>
                </View>

                {/* Data Usage Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                        How We Use Your Data
                    </Text>
                    <Text style={[styles.bodyText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget ornare quam vel facilisis
                        feugiat amet sagittis arcu, tortor. Sapien, consequat ultrices morbi orci semper sit nulla. Leo
                        auctor ut etiam est, amet aliquet ut vivamus. Odio vulputate est id tincidunt fames.
                    </Text>
                    <Text style={[styles.bodyText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget ornare quam vel facilisis
                        feugiat amet sagittis arcu, tortor. Sapien, consequat ultrices morbi orci semper sit nulla. Leo
                        auctor ut etiam est, amet aliquet ut vivamus. Odio vulputate est id tincidunt fames.
                    </Text>
                </View>

                {/* Data Sharing Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                        Data Sharing
                    </Text>
                    <Text style={[styles.bodyText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget ornare quam vel facilisis
                        feugiat amet sagittis arcu, tortor. Sapien, consequat ultrices morbi orci semper sit nulla. Leo
                        auctor ut etiam est, amet aliquet ut vivamus. Odio vulputate est id tincidunt fames.
                    </Text>
                    <Text style={[styles.bodyText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget ornare quam vel facilisis
                        feugiat amet sagittis arcu, tortor. Sapien, consequat ultrices morbi orci semper sit nulla. Leo
                        auctor ut etiam est, amet aliquet ut vivamus. Odio vulputate est id tincidunt fames.
                    </Text>
                </View>

                {/* Data Security Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                        Data Security
                    </Text>
                    <Text style={[styles.bodyText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget ornare quam vel facilisis
                        feugiat amet sagittis arcu, tortor. Sapien, consequat ultrices morbi orci semper sit nulla. Leo
                        auctor ut etiam est, amet aliquet ut vivamus. Odio vulputate est id tincidunt fames.
                    </Text>
                    <Text style={[styles.bodyText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget ornare quam vel facilisis
                        feugiat amet sagittis arcu, tortor. Sapien, consequat ultrices morbi orci semper sit nulla. Leo
                        auctor ut etiam est, amet aliquet ut vivamus. Odio vulputate est id tincidunt fames.
                    </Text>
                </View>

                {/* Your Rights Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                        Your Privacy Rights
                    </Text>
                    <Text style={[styles.bodyText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget ornare quam vel facilisis
                        feugiat amet sagittis arcu, tortor. Sapien, consequat ultrices morbi orci semper sit nulla. Leo
                        auctor ut etiam est, amet aliquet ut vivamus. Odio vulputate est id tincidunt fames.
                    </Text>
                    <Text style={[styles.bodyText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget ornare quam vel facilisis
                        feugiat amet sagittis arcu, tortor. Sapien, consequat ultrices morbi orci semper sit nulla. Leo
                        auctor ut etiam est, amet aliquet ut vivamus. Odio vulputate est id tincidunt fames.
                    </Text>
                </View>
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        lineHeight: 24,
    },
    bodyText: {
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 12,
        textAlign: 'justify',
    },
});

export default PrivacyPolicy;