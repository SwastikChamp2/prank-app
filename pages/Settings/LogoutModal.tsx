// components/LogoutModal.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  useColorScheme,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Fonts } from '../../constants/theme';
import { signOutUser } from '../../services/AuthServices';

interface LogoutModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ visible, onClose, onConfirm }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    try {
      // Sign out from Firebase
      await signOutUser();

      // Call onConfirm callback if provided
      if (onConfirm) {
        onConfirm();
      }

      // Close modal
      onClose();

      // Navigate to get-started page
      // Using replace to prevent going back to authenticated pages
      router.replace('/get-started');

    } catch (error: any) {
      setLoading(false);
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
            disabled={loading}
          >
            <Ionicons name="close" size={24} color={theme.text} />
          </TouchableOpacity>

          {/* Modal Content */}
          <View style={styles.content}>
            <Text style={[styles.title, { color: theme.text, fontFamily: Fonts.semiBold }]}>
              Are you sure you want to logout?
            </Text>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              {/* Cancel Button */}
              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  { backgroundColor: theme.primary },
                  loading && styles.buttonDisabled
                ]}
                onPress={onClose}
                activeOpacity={0.8}
                disabled={loading}
              >
                <Text style={[styles.cancelButtonText, { fontFamily: Fonts.semiBold }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              {/* Logout Button */}
              <TouchableOpacity
                style={[styles.logoutButton, loading && styles.buttonDisabled]}
                onPress={handleLogout}
                activeOpacity={0.7}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={theme.logoutRed || '#FF3B30'} size="small" />
                ) : (
                  <Text style={[
                    styles.logoutButtonText,
                    { color: theme.logoutRed || '#FF3B30', fontFamily: Fonts.semiBold }
                  ]}>
                    Log Out
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  content: {
    alignItems: 'center',
    paddingTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 26,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  cancelButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default LogoutModal;