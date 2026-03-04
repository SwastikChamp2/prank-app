// components/HelpSupportDrawer.tsx
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    useColorScheme,
    Modal,
    Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../../constants/theme';

interface HelpSupportDrawerProps {
    visible: boolean;
    onClose: () => void;
}

const HelpSupportDrawer: React.FC<HelpSupportDrawerProps> = ({ visible, onClose }) => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const contactInfo = {
        email: 'support@helmetwash.com',
        phone: '+91 98765 43210',
        whatsapp: '+91 98765 43210',
        address: '123 Clean Street, Tech Park\nMumbai, Maharashtra 400001\nIndia',
        workingHours: 'Mon - Sat: 9:00 AM - 8:00 PM\nSunday: 10:00 AM - 6:00 PM',
    };

    const helpSections = [
        {
            icon: 'document-text-outline',
            title: 'FAQs',
            description: 'Find answers to common questions',
            action: () => console.log('Open FAQs'),
        },
        {
            icon: 'chatbubble-ellipses-outline',
            title: 'Live Chat',
            description: 'Chat with our support team',
            action: () => console.log('Open Live Chat'),
        },
        {
            icon: 'videocam-outline',
            title: 'Video Tutorials',
            description: 'Learn how to use the app',
            action: () => console.log('Open Tutorials'),
        },
        {
            icon: 'bug-outline',
            title: 'Report a Bug',
            description: 'Help us improve the app',
            action: () => console.log('Report Bug'),
        },
    ];

    const handleEmailPress = () => {
        Linking.openURL(`mailto:${contactInfo.email}`);
    };

    const handlePhonePress = () => {
        Linking.openURL(`tel:${contactInfo.phone}`);
    };

    const handleWhatsAppPress = () => {
        Linking.openURL(`whatsapp://send?phone=${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`);
    };

    const handleAddressPress = () => {
        const address = contactInfo.address.replace(/\n/g, ', ');
        Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(address)}`);
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={onClose}
                />

                <View style={[styles.drawerContainer, { backgroundColor: theme.background }]}>
                    {/* Handle Bar */}
                    <View style={styles.handleContainer}>
                        <View style={[styles.handle, { backgroundColor: theme.grey }]} />
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {/* Header */}
                        <View style={styles.header}>
                            <View style={[styles.iconContainer, { backgroundColor: theme.lightOrange }]}>
                                <Ionicons name="headset-outline" size={32} color={theme.primary} />
                            </View>
                            <Text style={[styles.drawerTitle, { color: theme.text, fontFamily: Fonts.bold }]}>
                                Help & Support
                            </Text>
                            <Text style={[styles.subtitle, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                We're here to help you
                            </Text>
                        </View>

                        {/* Quick Actions */}
                        {/* <View style={styles.quickActionsSection}>
                            <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                                Quick Actions
                            </Text>
                            <View style={styles.quickActionsGrid}>
                                {helpSections.map((section, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[styles.quickActionCard, { backgroundColor: theme.lightGrey }]}
                                        onPress={section.action}
                                        activeOpacity={0.7}
                                    >
                                        <View style={[styles.actionIconContainer, { backgroundColor: theme.background }]}>
                                            <Ionicons name={section.icon as any} size={24} color={theme.primary} />
                                        </View>
                                        <Text style={[styles.actionTitle, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                                            {section.title}
                                        </Text>
                                        <Text style={[styles.actionDescription, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                            {section.description}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View> */}

                        {/* Divider */}
                        {/* <View style={[styles.divider, { backgroundColor: theme.border }]} /> */}

                        {/* Contact Information */}
                        <View style={styles.contactSection}>
                            <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                                Contact Us
                            </Text>

                            {/* Email */}
                            <TouchableOpacity
                                style={styles.contactItem}
                                onPress={handleEmailPress}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.contactIconBox, { backgroundColor: theme.lightOrange }]}>
                                    <Ionicons name="mail-outline" size={22} color={theme.primary} />
                                </View>
                                <View style={styles.contactInfo}>
                                    <Text style={[styles.contactLabel, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                        Email
                                    </Text>
                                    <Text style={[styles.contactValue, { color: theme.text, fontFamily: Fonts.medium }]}>
                                        {contactInfo.email}
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={theme.grey} />
                            </TouchableOpacity>

                            {/* Phone */}
                            <TouchableOpacity
                                style={styles.contactItem}
                                onPress={handlePhonePress}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.contactIconBox, { backgroundColor: theme.lightOrange }]}>
                                    <Ionicons name="call-outline" size={22} color={theme.primary} />
                                </View>
                                <View style={styles.contactInfo}>
                                    <Text style={[styles.contactLabel, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                        Phone
                                    </Text>
                                    <Text style={[styles.contactValue, { color: theme.text, fontFamily: Fonts.medium }]}>
                                        {contactInfo.phone}
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={theme.grey} />
                            </TouchableOpacity>

                            {/* WhatsApp */}
                            <TouchableOpacity
                                style={styles.contactItem}
                                onPress={handleWhatsAppPress}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.contactIconBox, { backgroundColor: theme.lightOrange }]}>
                                    <Ionicons name="logo-whatsapp" size={22} color={theme.primary} />
                                </View>
                                <View style={styles.contactInfo}>
                                    <Text style={[styles.contactLabel, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                        WhatsApp
                                    </Text>
                                    <Text style={[styles.contactValue, { color: theme.text, fontFamily: Fonts.medium }]}>
                                        {contactInfo.whatsapp}
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={theme.grey} />
                            </TouchableOpacity>

                            {/* Address */}
                            <TouchableOpacity
                                style={styles.contactItem}
                                onPress={handleAddressPress}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.contactIconBox, { backgroundColor: theme.lightOrange }]}>
                                    <Ionicons name="location-outline" size={22} color={theme.primary} />
                                </View>
                                <View style={styles.contactInfo}>
                                    <Text style={[styles.contactLabel, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                        Office Address
                                    </Text>
                                    <Text style={[styles.contactValue, { color: theme.text, fontFamily: Fonts.medium }]}>
                                        {contactInfo.address}
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={theme.grey} />
                            </TouchableOpacity>

                            {/* Working Hours */}
                            <View style={styles.contactItem}>
                                <View style={[styles.contactIconBox, { backgroundColor: theme.lightOrange }]}>
                                    <Ionicons name="time-outline" size={22} color={theme.primary} />
                                </View>
                                <View style={styles.contactInfo}>
                                    <Text style={[styles.contactLabel, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                        Working Hours
                                    </Text>
                                    <Text style={[styles.contactValue, { color: theme.text, fontFamily: Fonts.medium }]}>
                                        {contactInfo.workingHours}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Emergency Support */}
                        <View style={[styles.emergencyBox, { backgroundColor: theme.lightOrange }]}>
                            <Ionicons name="alert-circle-outline" size={24} color={theme.primary} />
                            <View style={styles.emergencyText}>
                                <Text style={[styles.emergencyTitle, { color: theme.primary, fontFamily: Fonts.semiBold }]}>
                                    Need Urgent Help?
                                </Text>
                                <Text style={[styles.emergencyDescription, { color: theme.text, fontFamily: Fonts.regular }]}>
                                    For immediate assistance, call us at {contactInfo.phone}
                                </Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    drawerContainer: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '90%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
    },
    handleContainer: {
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 8,
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        opacity: 0.3,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 32,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    iconContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    drawerTitle: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
    },
    quickActionsSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
    },
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    quickActionCard: {
        width: '48%',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    actionIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    actionTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
        textAlign: 'center',
    },
    actionDescription: {
        fontSize: 11,
        textAlign: 'center',
        lineHeight: 16,
    },
    divider: {
        height: 1,
        marginVertical: 24,
    },
    contactSection: {
        marginBottom: 20,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        gap: 12,
    },
    contactIconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contactInfo: {
        flex: 1,
    },
    contactLabel: {
        fontSize: 12,
        marginBottom: 4,
    },
    contactValue: {
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 20,
    },
    emergencyBox: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 12,
        gap: 12,
        alignItems: 'flex-start',
    },
    emergencyText: {
        flex: 1,
    },
    emergencyTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 4,
    },
    emergencyDescription: {
        fontSize: 13,
        lineHeight: 18,
    },
});

export default HelpSupportDrawer;